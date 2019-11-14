import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton, SelectInput, TextInput } from '@chainx/ui'
import $t from '../../../../../locale'
import { Label, Value } from '../../../components'
import { toPrecision } from '../../../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { xbtcBalanceSelector } from '../../../../CrossChainMining/selectors'
import {
  fetchXrcBtcBalance,
  xrcBtcBalanceSelector,
  xrcBtcXrc20InfoSelector
} from '../../../../../reducers/xrcBtcSlice'
import BigNumber from 'bignumber.js'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { getChainx } from '../../../../../services/chainx'
import { hexToU8a, u8aConcat, u8aToHex } from '@chainx/util'
import { u64 } from '@chainx/types'
import { fetchAccountAssets } from '../../../../../reducers/assetSlice'

export default function({ handleClose }) {
  const accountAddress = useSelector(addressSelector)
  const accountId = getChainx().account.decodeAddress(accountAddress)

  const options = ['X-BTC', 'XRC20-BTC'].map(token => ({
    value: token,
    label: token
  }))

  const xbtcBalance = useSelector(xbtcBalanceSelector)
  const xrcBtcBalance = useSelector(xrcBtcBalanceSelector)

  const [from, setFrom] = useState('X-BTC')
  const [to, setTo] = useState('XRC20-BTC')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const [disabled, setDisabled] = useState(false)

  const precision = 8
  const free = from === 'X-BTC' ? xbtcBalance : xrcBtcBalance

  const { address: contractAddress, selectors } = useSelector(
    xrcBtcXrc20InfoSelector
  )

  const dispatch = useDispatch()

  const convert = async () => {
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

    const gasLimit = 500000
    setDisabled(true)
    try {
      let status
      if (from === 'X-BTC') {
        status = await signAndSendExtrinsic(
          accountAddress,
          'xContracts',
          'convertToXrc20',
          ['BTC', realAmount, gasLimit]
        )
      } else {
        status = await signAndSendExtrinsic(
          accountAddress,
          'xContracts',
          'call',
          [
            contractAddress,
            0,
            gasLimit,
            u8aToHex(
              u8aConcat(
                hexToU8a(selectors.Destroy),
                new u64(realAmount).toU8a()
              )
            )
          ]
        )
      }

      const prefix = from === 'X-BTC' ? '划转' : '转回'

      const messages = {
        successTitle: `${prefix}成功`,
        failTitle: `${prefix}失败`,
        successMessage: `${prefix} ${amount} ${from}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      handleClose()
      dispatch(fetchXrcBtcBalance(accountId))
      dispatch(fetchAccountAssets(accountAddress))
    } catch (e) {
      setDisabled(false)
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
