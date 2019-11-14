import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { SelectInput, TextInput, AmountInput, PrimaryButton } from '@chainx/ui'
import $t from '../../../../../locale'
import { Label, Value } from '../../../components'
import { toPrecision } from '../../../../../utils'
import { useSelector } from 'react-redux'
import { xbtcBalanceSelector } from '../../../../CrossChainMining/selectors'
import { xrcBtcBalanceSelector } from '../../../../../reducers/xrcBtcSlice'
import BigNumber from 'bignumber.js'

export default function({ handleClose }) {
  const options = ['X-BTC', 'XRC20-BTC'].map(token => ({
    value: token,
    label: token
  }))

  const xbtcBalance = useSelector(xbtcBalanceSelector)
  console.log('xbtcBalance', xbtcBalance)

  const xrcBtcBalance = useSelector(xrcBtcBalanceSelector)
  console.log('xrcBtcBalance', xrcBtcBalance)

  const [from, setFrom] = useState('X-BTC')
  const [to, setTo] = useState('XRC20-BTC')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const [disabled, setDisabled] = useState(false)

  const precision = 8
  const free = from === 'X-BTC' ? xbtcBalance : xrcBtcBalance

  const convert = () => {
    if (isNaN(parseFloat(amount))) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_ERROR'))
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()
    if (realAmount > free) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_TOO_MUCH_ERROR'))
      return
    }

    if (realAmount <= 0) {
      setAmountErrMsg($t('COMMON_ASSET_TOO_LOW_ERROR'))
      return
    }
  }

  return (
    <StyledDialog open title={'划转'} handleClose={handleClose}>
      <main className="content">
        <div className="label">
          <div className="from">从</div>
          <div className="to">到</div>
        </div>

        <div className="input">
          <div className="from">
            <SelectInput
              value={from}
              onChange={value => {
                setFrom(value)
                setTo(value === 'XRC20-BTC' ? 'X-BTC' : 'XRC20-BTC')
              }}
              options={options}
            />
          </div>
          <div>
            <TextInput value={to} disabled={true} />
          </div>
        </div>

        <div className="amount">
          <div className="amount-input">
            <AmountInput
              value={amount}
              onChange={value => {
                setAmountErrMsg('')
                setAmount(value)
              }}
              placeholder={'划转数量'}
              precision={precision}
              error={!!amountErrMsg}
              errorText={amountErrMsg}
            />
          </div>
          <div className="balance">
            <Label>{$t('ASSET_BALANCE')}</Label>
            <Value>
              {toPrecision(free, precision)} {from}
            </Value>
          </div>
        </div>

        <div>
          <PrimaryButton disabled={disabled} size="fullWidth" onClick={convert}>
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </main>
    </StyledDialog>
  )
}
