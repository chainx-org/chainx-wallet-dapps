import $t from '../../../locale'
import { StyledDialog } from './styledComponents'
import React, { useEffect, useState } from 'react'
import { AmountInput, PrimaryButton, TextInput } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBalance,
  oddEvenBalanceSelector
} from '../../../reducers/oddevenSlice'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { retry, toPrecision } from '../../../utils'
import { Label, Value } from '../../AssetManagement/components'
import { isDemoSelector } from '../../../selectors'
import { decodeAddress } from '@chainx/keyring/address'
import { bufferToU8a, stringCamelCase } from '@chainx/util'
import bs58 from 'bs58'
import { parseParams } from '../../../utils/contractHelper'
import { contractAbi } from '../../../utils/contract'
import { Account } from 'chainx.js'
import { oddEvenContractAddress } from '../../../utils/constants'
import { getChainx } from '../../../services/chainx'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'

function isMainNetAddress(address) {
  try {
    const decoded = bufferToU8a(bs58.decode(address))
    if (decoded[0] !== 44) {
      return false
    }

    decodeAddress(address, false, 44)
  } catch (e) {
    return false
  }

  return true
}

export default function({ handleClose }) {
  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const isDemoAddr = useSelector(isDemoSelector)
  const balance = useSelector(oddEvenBalanceSelector)
  const precision = useSelector(pcxPrecisionSelector)

  const accountAddress = useSelector(addressSelector)

  const [address, setAddress] = useState('')
  const [addressErrMsg, setAddressErrMsg] = useState('')

  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    setAmount(toPrecision(balance, precision))
  }, [balance, precision])

  const dispatch = useDispatch()

  const sign = async () => {
    if (!isMainNetAddress(address)) {
      setAddressErrMsg('地址错误，请设置ChainX主网地址')
      return
    }

    if (balance <= 0) {
      setAmountErrMsg('金额过小')
      return
    }

    const withdrawAccountId = Account.decodeAddress(address, false, 44)
    const method = 'withdraw'
    const params = [balance, withdrawAccountId]
    parseParams(contractAbi.messages[stringCamelCase(method)].args, params)

    const args = [
      oddEvenContractAddress,
      0,
      5000000,
      contractAbi.messages[stringCamelCase(method)](...params)
    ]
    setDisabled(true)
    try {
      const ex = getChainx().api.tx.xContracts.call(...args)
      const status = await signAndSendExtrinsic(accountAddress, ex.toHex())

      const messages = {
        successTitle: '申请提现成功',
        failTitle: '申请提现失败',
        successMessage: `稍后请检查您的目的主网地址`,
        failMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      handleClose()

      retry(
        () => {
          Promise.all([dispatch(fetchBalance(address))])
        },
        5,
        2
      ).then(() => console.log('Refresh assets 5 times after transfer'))
    } finally {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog title={$t('WITHDRAW')} open handleClose={handleClose}>
      <div className="wrapper">
        <div className="amount">
          <p>
            <span>提现金额</span>
            <span>（暂时仅支持全额提现）</span>
          </p>
          <div className="input">
            <div>
              <AmountInput
                value={amount}
                disabled={true}
                precision={precision}
                error={!!amountErrMsg}
                errorText={amountErrMsg}
              />
            </div>
            {precision ? (
              <div>
                <Label>{$t('ASSET_BALANCE')}</Label>
                <Value>
                  <b>{toPrecision(balance, precision)}</b> PCX
                </Value>
              </div>
            ) : null}
          </div>
        </div>

        <div className="addr">
          <p>提现地址</p>
          <TextInput
            showClear={false}
            value={address}
            placeholder="输入主网地址"
            onChange={value => {
              setAddressErrMsg('')
              setAddress(value)
            }}
            onBlur={() => {
              setAddress((address || '').trim())
            }}
            error={!!addressErrMsg}
            errorText={addressErrMsg}
          />
        </div>

        <div className="operation">
          <PrimaryButton
            disabled={isDemoAddr || disabled || balance <= 0}
            size="fullWidth"
            onClick={sign}
          >
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </div>
    </StyledDialog>
  )
}
