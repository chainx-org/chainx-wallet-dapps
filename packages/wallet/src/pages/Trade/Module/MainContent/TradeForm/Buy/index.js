import React, { useState } from 'react'
import Wrapper from './Wrapper'
import { useSelector } from 'react-redux'
import {
  pairAssetFreeSelector,
  pairAssetSelector,
  pairCurrencyFreeSelector,
  pairCurrencySelector,
  pairPrecisionSelector
} from '../../../selectors'
import Free from '../components/Free'
import { AmountInput } from '@chainx/ui'
import Label from '../components/Label'

export default function() {
  const currencyFree = useSelector(pairCurrencyFreeSelector) || {}
  const pairCurrency = useSelector(pairCurrencySelector)
  const pairAsset = useSelector(pairAssetSelector)
  const pairPrecision = useSelector(pairPrecisionSelector)
  const assetFree = useSelector(pairAssetFreeSelector)

  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')

  return (
    <Wrapper>
      <Free
        asset={pairCurrency}
        free={currencyFree.free}
        precision={currencyFree.precision}
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
          precision={pairPrecision}
        />
      </div>
      <div className="amount input">
        <Label>数量</Label>
        <AmountInput
          style={{ maxWidth: 216 }}
          id="buy-amount"
          value={amount}
          onChange={value => setAmount(value)}
          tokenName={pairAsset}
          precision={assetFree && assetFree.precision}
        />
      </div>
    </Wrapper>
  )
}
