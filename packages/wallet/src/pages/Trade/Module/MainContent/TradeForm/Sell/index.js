import React, { useEffect, useState } from 'react'
import Wrapper from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import {
  currentShowPriceSelector,
  minSellPriceSelector,
  pairAssetFreeSelector,
  pairAssetSelector,
  pairCurrencyPrecision,
  pairCurrencySelector,
  pairPrecisionSelector,
  pairShowPrecisionSelector
} from '../../../selectors'
import Free from '../components/Free'
import Label from '../components/Label'
import { AmountInput, Slider, DangerButton } from '@chainx/ui'
import { marks } from '../constants'
import { retry, toPrecision } from '../../../../../../utils'
import { addressSelector } from '../../../../../../reducers/addressSlice'
import { isDemoSelector } from '../../../../../../selectors'
import BigNumber from 'bignumber.js'
import { Error } from '../Buy/Wrapper'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../../utils/chainxProvider'
import {
  currentPairIdSelector,
  fetchQuotations
} from '../../../../../../reducers/tradeSlice'
import $t from '../../../../../../locale'
import { getChainx } from '../../../../../../services/chainx'

export default function() {
  const pairPrecision = useSelector(pairPrecisionSelector)
  const { precision: assetPrecision = 0, free: assetFree = 0 } =
    useSelector(pairAssetFreeSelector) || {}
  const pairCurrency = useSelector(pairCurrencySelector)
  const pairAsset = useSelector(pairAssetSelector)
  const pairShowPrecision = useSelector(pairShowPrecisionSelector)
  const showPrice = useSelector(currentShowPriceSelector)

  const [price, setPrice] = useState('')
  const [priceInit, setPriceInit] = useState(false)
  const [amount, setAmount] = useState('0')

  const [percentage, setPercentage] = useState(0)
  const currencyPrecision = useSelector(pairCurrencyPrecision)
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)

  useEffect(() => {
    if (!priceInit && showPrice) {
      setPrice(showPrice)
      setPriceInit(true)
    }
  }, [showPrice, priceInit])

  const volume = Number(
    Number(amount) * Number(price).toFixed(currencyPrecision)
  )

  const [disabled, setDisabled] = useState(false)
  const dispatch = useDispatch()

  const [priceErrMsg, setPriceErrMsg] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')
  const pairId = useSelector(currentPairIdSelector)

  const minSellPrice = useSelector(minSellPriceSelector)
  const minSellShowPrice = Number(
    toPrecision(minSellPrice, pairPrecision)
  ).toFixed(pairShowPrecision)

  const chainx = getChainx()

  const sign = async () => {
    const realPrice = BigNumber(price)
      .multipliedBy(Math.pow(10, pairPrecision))
      .toNumber()
    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, assetPrecision))
      .toNumber()

    if (realPrice <= 0) {
      setPriceErrMsg('无效价格')
      return
    }

    if (minSellPrice && realPrice < minSellPrice) {
      setPriceErrMsg(`最小价格${minSellShowPrice}`)
      return
    }

    if (realAmount <= 0) {
      setAmountErrMsg('无效数量')
      return
    }

    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    setDisabled(true)
    try {
      const extrinsic = chainx.trade.putOrder(
        pairId,
        'Limit',
        'Sell',
        realAmount,
        realPrice
      )
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )

      const messages = {
        successTitle: '买单成功',
        failTitle: '买单失败',
        successMessage: `买单数量 ${amount} ${pairAsset}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      await retry(
        () => {
          dispatch(fetchQuotations(pairId))
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
        <Free asset={pairAsset} free={assetFree} precision={assetPrecision} />
        <Error>{priceErrMsg || amountErrMsg}</Error>
      </div>

      <div className="price input">
        <Label htmlFor="sell-price">价格</Label>
        <AmountInput
          style={{ maxWidth: 216 }}
          id="sell-price"
          value={price}
          onChange={value => {
            setPrice(value)
            setPriceErrMsg('')
          }}
          tokenName={pairCurrency}
          precision={pairShowPrecision}
        />
      </div>

      <div className="amount input">
        <Label>数量</Label>
        <AmountInput
          style={{ maxWidth: 216 }}
          id="sell-amount"
          value={amount}
          onChange={value => {
            setAmountErrMsg('')
            if (value * Math.pow(10, assetPrecision) > assetFree) {
              setAmount(toPrecision(assetFree, assetPrecision))
              setPercentage(100)
            } else {
              setAmount(value)
              setPercentage(
                ((value * Math.pow(10, assetPrecision)) / assetFree) * 100
              )
            }
          }}
          tokenName={pairAsset}
          precision={assetPrecision}
        />
      </div>

      <Slider
        className="percentage"
        onChange={value => {
          setPercentage(value)
          setAmount(toPrecision((assetFree * value) / 100, assetPrecision))
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
        <DangerButton
          disabled={isDemoAddr || disabled}
          size="fullWidth"
          onClick={sign}
        >
          {$t('TRADE_SELL')} {pairAsset}
        </DangerButton>
      </div>
    </Wrapper>
  )
}
