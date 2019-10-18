import React, { useState } from 'react'
import styled from 'styled-components'
import {
  AmountInput,
  Dialog,
  PrimaryButton,
  SelectInput,
  TextInput
} from '@chainx/ui'
import $t from '../../../locale'
import { pcxFreeSelector } from './selectors'
import { useSelector } from 'react-redux'
import { toPrecision } from '../../../utils'

const Label = styled.label`
  opacity: 0.32;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.12px;
  line-height: 20px;
`

const Value = styled.span`
  opacity: 0.72;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.12px;
  line-height: 20px;
`

export default function({ open, handleClose }) {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  const free = useSelector(pcxFreeSelector)

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

        <div style={{ display: 'flex', marginTop: 16, alignItems: 'center' }}>
          <div style={{ width: '50%' }}>
            <AmountInput
              value={amount}
              onChange={setAmount}
              placeholder={$t('ASSET_TRANSFER_AMOUNT')}
              tokenName="PCX"
              precision={8}
            />
          </div>
          {free ? (
            <div style={{ marginLeft: 16 }}>
              <Label>{$t('ASSET_BALANCE')}</Label>
              <Value>{toPrecision(free.free, free.precision)} PCX</Value>
            </div>
          ) : null}
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
