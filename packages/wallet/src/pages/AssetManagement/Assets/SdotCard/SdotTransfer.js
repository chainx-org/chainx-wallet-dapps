import React, { useState } from 'react'

import {
  Dialog,
  SelectInput,
  AmountInput,
  TextInput,
  PrimaryButton
} from '@chainx/ui'

export default function SdotTransfer({ open, handleClose }) {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  const createOption = (lable1, lable2) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <div>{lable1}</div>
        <div>{lable2}</div>
      </div>
    )
  }

  return (
    <Dialog open={open} handleClose={handleClose} title="Transfer(S-DOT)">
      <div style={{ padding: 16 }}>
        <div>
          <SelectInput
            value={address}
            placeholder="ChainX 接收地址"
            onChange={setAddress}
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(value => ({
              value,
              lable: createOption(`${value}`, `${value}`)
            }))}
          />
        </div>
        <div style={{ marginTop: 16, width: '50%' }}>
          <AmountInput
            value={amount}
            onChange={setAmount}
            placeholder="转账数量"
            tokenName="SDOT"
            precision={3}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextInput value={memo} onChange={setMemo} placeholder="备注" />
        </div>
        <div style={{ marginTop: 16 }}>
          <PrimaryButton size="fullWidth">确定</PrimaryButton>
        </div>
      </div>
    </Dialog>
  )
}
