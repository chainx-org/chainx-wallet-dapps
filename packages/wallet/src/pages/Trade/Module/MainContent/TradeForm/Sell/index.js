import React, { useState } from 'react'
import Wrapper from './Wrapper'
import { useSelector } from 'react-redux'
import {
  pairAssetFreeSelector,
  pairAssetSelector,
  pairCurrencySelector,
  pairPrecisionSelector
} from '../../../selectors'
import Free from '../components/Free'
import Label from '../components/Label'
import { AmountInput } from '@chainx/ui'

export default function() {
  const assetFree = useSelector(pairAssetFreeSelector) || {}
  const pairCurrency = useSelector(pairCurrencySelector)
  const pairAsset = useSelector(pairAssetSelector)
  const pairPrecision = useSelector(pairPrecisionSelector)

  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')

  return (
    <Wrapper>
      <Free
        asset={pairAsset}
        free={assetFree.free}
        precision={assetFree.precision}
      />

      <div className="price input">
        <Label htmlFor="sell-price">价格</Label>
        {/*TODO: 设置默认价格*/}
        <AmountInput
          style={{ maxWidth: 216 }}
          id="sell-price"
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
