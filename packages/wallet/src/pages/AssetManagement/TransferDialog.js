import React, { useState } from 'react'
import { AmountInput, Dialog, PrimaryButton, SelectInput } from '@chainx/ui'
import styled from 'styled-components'
import $t from '../../locale'
import { canRequestSign, retry, toPrecision } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../reducers/addressSlice'
import BigNumber from 'bignumber.js'
import { Label, Value } from './components'
import { showSnack, signAndSendExtrinsic } from '../../utils/chainxProvider'
import {
  fetchAccountAssets,
  pcxPrecisionSelector
} from '../../reducers/assetSlice'
import { checkAmountAndHasError } from '../../utils/errorCheck'
import { isDemoSelector } from '../../selectors'
import {
  pcxFreeSelector,
  xbtcFreeSelector,
  xbtcIdSelector,
  xbtcPrecisionSelector
} from '@reducers/assetSlice'
import { Account } from '@chainx-v2/account'

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
  const pcxPrecision = useSelector(pcxPrecisionSelector)

  const xbtcFree = useSelector(xbtcFreeSelector)
  const xbtcPrecision = useSelector(xbtcPrecisionSelector)
  const xbtcId = useSelector(xbtcIdSelector)
  const isBtc = token === 'XBTC'

  let free = pcxFree
  let precision = pcxPrecision
  if (isBtc) {
    free = xbtcFree
    precision = xbtcPrecision
  }

  const [disabled, setDisabled] = useState(false)
  const dispatch = useDispatch()
  const tokenName = token

  const sign = async () => {
    const isAddressValid = Account.isAddressValid(address)
    if (!isAddressValid) {
      setAddressErrMsg($t('ASSET_TRANSFER_ADDR_ERROR'))
      return
    }

    if (
      checkAmountAndHasError(amount, free, precision, setAmountErrMsg) ||
      !canRequestSign()
    ) {
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toString()

    setDisabled(true)
    try {
      const status = await signAndSendExtrinsic(accountAddress, {
        section: isBtc ? 'xAssets' : 'balances',
        method: 'transfer',
        params: isBtc ? [address, xbtcId, realAmount] : [address, realAmount]
      })

      const messages = {
        successTitle: $t('NOTIFICATION_TRANSFER_SUCCESS'),
        failTitle: $t('NOTIFICATION_TRANSFER_FAIL'),
        successMessage: `${$t(
          'NOTIFICATION_TRANSFER_AMOUNT'
        )} ${amount} ${tokenName}`,
        failMessage: ``
      }

      showSnack(status, messages, dispatch)
      handleClose()
      retry(
        () => {
          Promise.all([dispatch(fetchAccountAssets(accountAddress))])
        },
        5,
        2
      ).then(() => console.log('Refresh assets 5 times after transfer'))
    } catch (e) {
      console.error('sign transfer transaction error:', e)
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
            placeholder={$t('asset_chainx_receive_addr')}
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
