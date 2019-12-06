import React, { useEffect, useState } from 'react'
import Wrapper from './Wrapper'
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

  const sign = async () => {
    setDisabled(true)

    const realPrice = BigNumber(price)
      .multipliedBy(Math.pow(10, pairPrecision))
      .toNumber()
    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, assetPrecision))
      .toNumber()

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
      <Free
        asset={pairCurrency}
        free={currencyFree.free}
        precision={currencyPrecision}
      />
      <div className="price input">
        <Label htmlFor="buy-price">价格</Label>
        {/*TODO: 设置默认价格*/}
        <AmountInput
          style={{ maxWidth: 216 }}
          id="buy-price"
          value={price}
          onChange={value => {
            setPrice(value)
          }}
          tokenName={pairCurrency}
          precision={pairShowPrecision}
        />
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
