import React, { useState } from 'react'
import {
  AmountInput,
  Dialog,
  PrimaryButton,
  SelectInput,
  TextInput
} from '@chainx/ui'
import $t from '../../../locale'

export default function({ open, handleClose }) {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  return (
    <Dialog open={open} handleClose={handleClose} title="Transfer(PCX)">
      <div style={{ padding: 16 }}>
        <div>
          <SelectInput
            value={address}
            placeholder="ChainX 接收地址"
            onChange={setAddress}
          />
        </div>

        <div style={{ marginTop: 16, width: '50%' }}>
          <AmountInput
            value={amount}
            onChange={setAmount}
            placeholder={$t('ASSET_TRANSFER_AMOUNT')}
            tokenName="PCX"
            precision={8}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <TextInput
            value={memo}
            onChange={setMemo}
            placeholder={$t('COMMON_MEMO')}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <PrimaryButton
            size="fullWidth"
            onClick={() => console.log('transfer pcx')}
          >
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </div>
    </Dialog>
  )
}
