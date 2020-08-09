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
import { canRequestSign, retry, toPrecision } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { xbtcFreeSelector } from './Assets/XbtcCard/selectors'
import { getChainx } from '../../services/chainx'
import { addressSelector } from '../../reducers/addressSlice'
import BigNumber from 'bignumber.js'
import { sdotFreeSelector } from './Assets/selectors'
import { Label, Value } from './components'
import { showSnack, signAndSendExtrinsic } from '../../utils/chainxProvider'
import { fetchAccountAssets, pcxAssetSelector } from '../../reducers/assetSlice'
import {
  checkAmountAndHasError,
  checkMemoAndHasError
} from '../../utils/errorCheck'
import { isDemoSelector } from '../../selectors'
import { fetchTransfers } from '../../reducers/transactionSlice'
import { accountIdSelector } from '../selectors/assets'
import { pcxFreeSelector } from '@reducers/assetSlice'

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

  const pcxFree = useSelector(pcxFreeSelector)
  console.log('pcxFree', pcxFree)
  const pcxAsset = useSelector(pcxAssetSelector)
  console.log('pcxAsset', pcxAsset)

  // const { free: xbtcFree, precision: xbtcPrecision } = useSelector(
  //   xbtcFreeSelector
  // )
  //
  // const { free: pcxFree, precision: pcxPrecision } = useSelector(
  //   pcxFreeSelector
  // )

  let free = 0
  let precision = 8
  // if (token === 'BTC') {
  //   free = xbtcFree
  //   precision = xbtcPrecision
  // }

  const [memo, setMemo] = useState('')
  const [memoErrMsg, setMemoErrMsg] = useState('')
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch()

  const tokenName = token === 'BTC' ? 'X-BTC' : token

  const chainx = getChainx()
  // const accountId = useSelector(accountIdSelector)
  const accountId = null

  const sign = async () => {
    const isAddressValid = chainx.account.isAddressValid(address)
    if (!isAddressValid) {
      setAddressErrMsg($t('ASSET_TRANSFER_ADDR_ERROR'))
      return
    }

    if (
      checkAmountAndHasError(amount, free, precision, setAmountErrMsg) ||
      checkMemoAndHasError(memo, setMemoErrMsg) ||
      !canRequestSign()
    ) {
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
      retry(
        () => {
          Promise.all([
            dispatch(fetchAccountAssets(accountAddress)),
            dispatch(fetchTransfers(accountId))
          ])
        },
        5,
        2
      ).then(() => console.log('Refresh assets 5 times after transfer'))
    } catch (e) {
      console.log('sign transfer transaction error:', e)
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
            onBlur={() => {
              setAddress((address || '').trim())
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
