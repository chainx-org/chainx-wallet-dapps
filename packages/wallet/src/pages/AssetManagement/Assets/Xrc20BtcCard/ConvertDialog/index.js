import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { SelectInput, TextInput, AmountInput, PrimaryButton } from '@chainx/ui'
import $t from '../../../../../locale'
import { Label, Value } from '../../../components'
import { toPrecision } from '../../../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { xbtcBalanceSelector } from '../../../../CrossChainMining/selectors'
import {
  fetchXrcBtcBalance,
  xrcBtcBalanceSelector
} from '../../../../../reducers/xrcBtcSlice'
import BigNumber from 'bignumber.js'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { getChainx } from '../../../../../services/chainx'
import { token } from '../../../../../utils/constants'

export default function({ handleClose }) {
  const accountAddress = useSelector(addressSelector)
  const accountId = getChainx().account.decodeAddress(accountAddress)

  const options = [token.XBTC, 'XRC20-BTC'].map(token => ({
    value: token,
    label: token
  }))

  const xbtcBalance = useSelector(xbtcBalanceSelector)
  const xrcBtcBalance = useSelector(xrcBtcBalanceSelector)

  const [from, setFrom] = useState(token.XBTC)
  const [to, setTo] = useState('XRC20-BTC')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const [disabled, setDisabled] = useState(false)

  const precision = 8
  const free = from === 'X-BTC' ? xbtcBalance : xrcBtcBalance

  const dispatch = useDispatch()

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

    setDisabled(true)
    signAndSendExtrinsic(accountAddress, 'xContracts', 'convertToXrc20', [
      'BTC',
      realAmount,
      500000
    ])
      .then(status => {
        const messages = {
          successTitle: '划转成功',
          failTitle: '划转失败',
          successMessage: `转账数量 ${amount} ${from}`,
          failMessage: `交易hash ${status.txHash}`
        }

        return showSnack(status, messages, dispatch)
      })
      .then(() => {
        handleClose()
        dispatch(fetchXrcBtcBalance(accountId))
      })
      .catch(() => setDisabled(false))
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
