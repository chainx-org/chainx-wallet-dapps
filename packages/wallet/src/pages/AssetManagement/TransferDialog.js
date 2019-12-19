import React, { useState } from 'react'
import {
  AmountInput,
  Dialog,
  PrimaryButton,
  SelectInput,
  TextInput
} from '@chainx/ui'
import styled from 'styled-components'
import $t from '../../locale'
import { retry, toPrecision } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { xbtcFreeSelector } from './Assets/XbtcCard/selectors'
import { getChainx } from '../../services/chainx'
import { addressSelector } from '../../reducers/addressSlice'
import BigNumber from 'bignumber.js'
import { sdotFreeSelector } from './Assets/selectors'
import { pcxFreeSelector } from './PcxCard/selectors'
import { Label, Value } from './components'
import { showSnack, signAndSendExtrinsic } from '../../utils/chainxProvider'
import { fetchAccountAssets } from '../../reducers/assetSlice'
import {
  checkAmountAndHasError,
  checkMemoAndHasError
} from '../../utils/errorCheck'
import { isDemoSelector } from '../../selectors'
import { fetchTransfers } from '../../reducers/transactionSlice'
import { accountIdSelector } from '../selectors/assets'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;
    & > div:not(:first-of-type) {
      margin-top: 16px;
    }

    & > div.amount {
      display: flex;
      align-items: center;

      & > div:first-of-type {
        width: 50%;
      }

      & > div:last-of-type {
        margin-left: 16px;
      }
    }
  }
`

export default function({ handleClose, token }) {
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)

  const [address, setAddress] = useState('')
  const [addressErrMsg, setAddressErrMsg] = useState('')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const { free: xbtcFree, precision: xbtcPrecision } = useSelector(
    xbtcFreeSelector
  )
  const { free: sdotFree, precision: sdotPrecision } = useSelector(
    sdotFreeSelector
  )

  const { free: pcxFree, precision: pcxPrecision } = useSelector(
    pcxFreeSelector
  )

  let free = pcxFree
  let precision = pcxPrecision
  if (token === 'SDOT') {
    free = sdotFree
    precision = sdotPrecision
  } else if (token === 'BTC') {
    free = xbtcFree
    precision = xbtcPrecision
  }

  const [memo, setMemo] = useState('')
  const [memoErrMsg, setMemoErrMsg] = useState('')
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch()

  const tokenName = token === 'BTC' ? 'X-BTC' : token

  const chainx = getChainx()
  const accountId = useSelector(accountIdSelector)

  const sign = async () => {
    const isAddressValid = chainx.account.isAddressValid(address)
    if (!isAddressValid) {
      setAddressErrMsg($t('ASSET_TRANSFER_ADDR_ERROR'))
      return
    }

    if (checkAmountAndHasError(amount, free, precision, setAmountErrMsg)) {
      return
    }

    if (checkMemoAndHasError(memo, setMemoErrMsg)) {
      return
    }

    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()

    setDisabled(true)
    try {
      const extrinsic = chainx.asset.transfer(address, token, realAmount, memo)
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )
      const messages = {
        successTitle: $t('NOTIFICATION_TRANSFER_SUCCESS'),
        failTitle: $t('NOTIFICATION_TRANSFER_FAIL'),
        successMessage: `${$t(
          'NOTIFICATION_TRANSFER_AMOUNT'
        )} ${amount} ${tokenName}`,
        failMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      handleClose()
      await retry(
        () => {
          dispatch(fetchAccountAssets(accountAddress))
          dispatch(fetchTransfers(accountId))
        },
        5,
        2
      )
    } catch (e) {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog
      title={`Transfer(${tokenName})`}
      open
      handleClose={handleClose}
    >
      <div className="wrapper">
        <div>
          <SelectInput
            value={address}
            placeholder="ChainX 接收地址"
            onChange={value => {
              setAddressErrMsg('')
              setAddress(value)
            }}
            error={!!addressErrMsg}
            errorText={addressErrMsg}
          />
        </div>

        <div className="amount">
          <div>
            <AmountInput
              value={amount}
              onChange={value => {
                setAmountErrMsg('')
                setAmount(value)
              }}
              placeholder={$t('ASSET_TRANSFER_AMOUNT')}
              precision={precision}
              error={!!amountErrMsg}
              errorText={amountErrMsg}
            />
          </div>
          {precision ? (
            <div>
              <Label>{$t('ASSET_BALANCE')}</Label>
              <Value>
                {toPrecision(free, precision)} {tokenName}
              </Value>
            </div>
          ) : null}
        </div>

        <div>
          <TextInput
            value={memo}
            onChange={value => {
              setMemoErrMsg('')
              setMemo(value)
            }}
            multiline={true}
            rows={2}
            placeholder={$t('COMMON_MEMO')}
            error={!!memoErrMsg}
            errorText={memoErrMsg}
          />
        </div>

        <div>
          <PrimaryButton
            disabled={isDemoAddr || disabled}
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
