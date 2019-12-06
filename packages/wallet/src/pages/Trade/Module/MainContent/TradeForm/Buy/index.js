import React, { useEffect, useState } from 'react'
import Wrapper, { Error } from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import {
  currentShowPriceSelector,
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
import { normalizeNumber } from '../../../../../../utils'
import { isDemoSelector } from '../../../../../../selectors'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../../utils/chainxProvider'
import {
  currentPairIdSelector,
  fetchQuotations
} from '../../../../../../reducers/tradeSlice'
import { addressSelector } from '../../../../../../reducers/addressSlice'
import BigNumber from 'bignumber.js'

export default function() {
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

  const [price, setPrice] = useState('')
  const [priceInit, setPriceInit] = useState(false)
  const [amount, setAmount] = useState('0')

  const [percentage, setPercentage] = useState(0)
  const marks = [
    { value: 0 },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100 }
  ]

  const volume = Number(
    Number(amount) * Number(price).toFixed(currencyPrecision)
  )

  useEffect(() => {
    if (!priceInit && showPrice) {
      setPrice(showPrice)
      setPriceInit(true)
    }
  }, [showPrice, priceInit])

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

  const sign = async () => {
    const realPrice = BigNumber(price)
      .multipliedBy(Math.pow(10, pairPrecision))
      .toNumber()
    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, assetPrecision))
      .toNumber()

    console.log('realPrice', realPrice)
    console.log('realAmount', realAmount)

    if (realPrice <= 0) {
      setPriceErrMsg('无效价格')
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
      const status = await signAndSendExtrinsic(
        accountAddress,
        'xSpot',
        'putOrder',
        [pairId, 'Limit', 'Buy', realAmount, realPrice]
      )

      const messages = {
        successTitle: '买单成功',
        failTitle: '买单失败',
        successMessage: `买单数量 ${amount} ${pairAsset}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      dispatch(fetchQuotations(pairId))
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
        <Label htmlFor="buy-price">价格</Label>
        {/*TODO: 设置默认价格*/}
        <div>
          <AmountInput
            style={{ maxWidth: 216 }}
            id="buy-price"
            value={price}
            onChange={value => {
              setPrice(value)
            }}
            tokenName={pairCurrency}
            precision={pairShowPrecision}
            error={!!priceErrMsg}
          />
        </div>
      </div>
      <div className="amount input">
        <Label>数量</Label>
        <AmountInput
          style={{ maxWidth: 216 }}
          id="buy-amount"
          value={amount}
          onChange={value => {
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
        <span>交易额 </span>
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
          买入 PCX
        </SuccessButton>
      </div>
    </Wrapper>
  )
}
