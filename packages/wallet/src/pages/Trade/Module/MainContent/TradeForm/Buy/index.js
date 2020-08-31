import React, { useEffect, useState } from 'react'
import Wrapper, { Error } from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import {
  pairAssetPrecision,
  pairAssetSelector,
  pairCurrencyFreeSelector,
  pairCurrencyPrecision,
  pairCurrencySelector
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
import { fetchQuotations } from '../../../../../../reducers/tradeSlice'
import { addressSelector } from '../../../../../../reducers/addressSlice'
import BigNumber from 'bignumber.js'
import { marks } from '../constants'
import $t from '../../../../../../locale'
import { getChainx } from '../../../../../../services/chainx'
import infoIcon from '../../assets/info.svg'
import { PriceWrapper } from '../components/PriceWrapper'
import EventEmitter, { events } from '../../../eventEmitter'
import {
  fetchAccountAssets,
  normalizedAssetsSelector
} from '../../../../../../reducers/assetSlice'
import {
  currentPairIdSelector,
  maxBuyShowPriceSelector
} from '@reducers/dexSlice'
import {
  pairPipPrecisionSelector,
  pairPrecisionSelector,
  showPriceSelector
} from '@pages/Trade/Module/AskBid/dexSelectors'

export default function() {
  const address = useSelector(addressSelector)
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)

  const pairId = useSelector(currentPairIdSelector)
  const currencyFree = useSelector(pairCurrencyFreeSelector) || {}
  const pairCurrency = useSelector(pairCurrencySelector)
  const pairAsset = useSelector(pairAssetSelector)
  const pairShowPrecision = useSelector(pairPrecisionSelector)
  const pairPrecision = useSelector(pairPipPrecisionSelector)
  const assetPrecision = useSelector(pairAssetPrecision)
  const showPrice = useSelector(showPriceSelector)

  const currencyPrecision = useSelector(pairCurrencyPrecision)
  const maxBuyPrice = useSelector(maxBuyShowPriceSelector)
  const maxBuyShowPrice = Number(
    toPrecision(maxBuyPrice, pairPrecision)
  ).toFixed(pairShowPrecision)

  const xbtc = useSelector(normalizedAssetsSelector).find(
    a => a.token === 'XBTC'
  )

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

  EventEmitter.subscribe(events.priceClicked, price => setPrice(price))

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
          dispatch(fetchAccountAssets(address))
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
        {xbtc && (
          <Free
            asset={xbtc.token}
            free={xbtc.details.free}
            precision={xbtc.precision}
          />
        )}
        <Error>{priceErrMsg || amountErrMsg}</Error>
      </div>
      <div className="price input">
        <PriceWrapper
          data-tip={$t('TRADE_MAX_BUY_PRICE', { price: maxBuyShowPrice })}
        >
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
          disabled={isDemoAddr || disabled || pairId === 1}
          size="fullWidth"
          onClick={sign}
        >
          {$t('TRADE_BUY')} {pairAsset}
        </SuccessButton>
      </div>
    </Wrapper>
  )
}
