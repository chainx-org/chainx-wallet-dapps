import React, { useEffect, useState } from 'react'
import Wrapper, { Error } from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import {
  currentShowPriceSelector,
  maxBuyPriceSelector,
  pairAssetPrecision,
  pairAssetSelector,
  pairCurrencyFreeSelector,
  pairCurrencyPrecision,
  pairCurrencySelector,
  pairPrecisionSelector,
  pairShowPrecisionSelector
} from '../../../selectors'
import Free from '../components/Free'
import { AmountInput, Slider, SuccessButton } from '@chainx/ui'
import Label from '../components/Label'
import {
  canRequestSign,
  normalizeNumber,
  retry,
  toPrecision
} from '../../../../../../utils'
import { isDemoSelector } from '../../../../../../selectors'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../../utils/chainxProvider'
import {
  currentPairIdSelector,
  fetchNowOrders,
  fetchQuotations
} from '../../../../../../reducers/tradeSlice'
import { addressSelector } from '../../../../../../reducers/addressSlice'
import BigNumber from 'bignumber.js'
import { marks } from '../constants'
import $t from '../../../../../../locale'
import { getChainx } from '../../../../../../services/chainx'
import infoIcon from '../../assets/info.svg'
import { PriceWrapper } from '../components/PriceWrapper'
import { accountIdSelector } from '../../../../../selectors/assets'

export default function() {
  const accountId = useSelector(accountIdSelector)
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)

  const pairId = useSelector(currentPairIdSelector)
  const currencyFree = useSelector(pairCurrencyFreeSelector) || {}
  const pairCurrency = useSelector(pairCurrencySelector)
  const pairAsset = useSelector(pairAssetSelector)
  const pairShowPrecision = useSelector(pairShowPrecisionSelector)
  const pairPrecision = useSelector(pairPrecisionSelector)
  const assetPrecision = useSelector(pairAssetPrecision)
  const showPrice = useSelector(currentShowPriceSelector)
  const currencyPrecision = useSelector(pairCurrencyPrecision)
  const maxBuyPrice = useSelector(maxBuyPriceSelector)
  const maxBuyShowPrice = Number(
    toPrecision(maxBuyPrice, pairPrecision)
  ).toFixed(pairShowPrecision)

  const [price, setPrice] = useState('')
  const [initPairId, setInitPairId] = useState(null)
  const [amount, setAmount] = useState('0')

  const [percentage, setPercentage] = useState(0)

  const volume = Number(
    Number(amount) * Number(price).toFixed(currencyPrecision)
  )

  useEffect(() => {
    if (initPairId !== pairId && showPrice) {
      setPrice(showPrice)
      setInitPairId(pairId)
    }
  }, [showPrice, pairId, initPairId])

  const [max, setMax] = useState(0)

  useEffect(() => {
    if (Number(price) <= 0 || !currencyFree.free) {
      return
    }

    const rawMax =
      currencyFree.free / (Number(price) * Math.pow(10, currencyPrecision))
    setMax(normalizeNumber(rawMax, currencyPrecision))
  }, [currencyFree, price, currencyPrecision])

  const [disabled, setDisabled] = useState(false)
  const dispatch = useDispatch()

  const [priceErrMsg, setPriceErrMsg] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const chainx = getChainx()

  const sign = async () => {
    const realPrice = BigNumber(price)
      .multipliedBy(Math.pow(10, pairPrecision))
      .toNumber()
    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, assetPrecision))
      .toNumber()

    if (realPrice <= 0) {
      setPriceErrMsg($t('TRADE_INVALID_PRICE'))
      return
    }

    if (maxBuyPrice && realPrice > maxBuyPrice) {
      setPriceErrMsg($t('TRADE_MAX_PRICE', { price: maxBuyShowPrice }))
      return
    }

    if (realAmount <= 0) {
      setAmountErrMsg($t('TRADE_INVALID_AMOUNT'))
      return
    }

    if (!canRequestSign()) {
      return
    }

    setDisabled(true)

    try {
      const extrinsic = chainx.trade.putOrder(
        pairId,
        'Limit',
        'Buy',
        realAmount,
        realPrice
      )
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )

      const messages = {
        successTitle: $t('TRADE_BUY_SUCCESS'),
        failTitle: $t('TRADE_BUY_FAIL'),
        successMessage: `买单数量 ${amount} ${pairAsset}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      await retry(
        () => {
          dispatch(fetchQuotations(pairId))
          dispatch(fetchNowOrders(accountId))
        },
        5,
        2
      )
    } finally {
      setDisabled(false)
    }
  }

  return (
    <Wrapper>
      <div className="info">
        <Free
          asset={pairCurrency}
          free={currencyFree.free}
          precision={currencyPrecision}
        />
        <Error>{priceErrMsg || amountErrMsg}</Error>
      </div>
      <div className="price input">
        <PriceWrapper data-tip={`最大买入价格${maxBuyShowPrice}`}>
          <Label htmlFor="buy-price">{$t('TRADE_PRICE')}</Label>
          <img src={infoIcon} alt="info" />
        </PriceWrapper>
        <div>
          <AmountInput
            style={{ width: 216 }}
            id="buy-price"
            value={price}
            onChange={value => {
              setPriceErrMsg('')
              setPrice(value)
            }}
            tokenName={pairCurrency}
            precision={pairShowPrecision}
            error={!!priceErrMsg}
          />
        </div>
      </div>
      <div className="amount input">
        <Label>{$t('TRADE_AMOUNT')}</Label>
        <AmountInput
          style={{ maxWidth: 216 }}
          id="buy-amount"
          value={amount}
          onChange={value => {
            setAmountErrMsg('')
            if (value > max) {
              setAmount(max)
              setPercentage(100)
            } else {
              setAmount(value)
              setPercentage((value / max) * 100)
            }
          }}
          tokenName={pairAsset}
          precision={assetPrecision}
          error={!!amountErrMsg}
        />
      </div>

      <Slider
        className="percentage"
        onChange={value => {
          setAmountErrMsg('')
          setPercentage(value)
          if (!currencyFree.free) {
            return
          }

          setAmount(((max * value) / 100).toFixed(assetPrecision))
        }}
        value={percentage}
        min={0}
        max={100}
        valueLabelDisplay="off"
        marks={marks}
      />
      <div className="volume">
        <span>{$t('TRADE_VOLUME')} </span>
        {pairCurrency ? (
          <span>
            {volume.toFixed(currencyPrecision)} {pairCurrency}
          </span>
        ) : null}
      </div>

      <div className="button">
        <SuccessButton
          disabled={isDemoAddr || disabled}
          size="fullWidth"
          onClick={sign}
        >
          {$t('TRADE_BUY')} {pairAsset}
        </SuccessButton>
      </div>
    </Wrapper>
  )
}
