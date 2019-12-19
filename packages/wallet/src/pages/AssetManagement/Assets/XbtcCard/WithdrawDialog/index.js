import React, { useEffect, useState } from 'react'
import { Label, Value } from '../../../components'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton, SelectInput, TextInput } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import { xbtcFreeSelector } from '../selectors'
import $t from '../../../../../locale'
import { retry, toPrecision } from '../../../../../utils'
import infoIcon from '../../../../../static/explan.svg'
import {
  btcWithdrawLimitSelector,
  fetchBtcWithdrawLimit
} from '../../../../../reducers/trustSlice'
import BigNumber from 'bignumber.js'
import { default as WAValidator } from 'wallet-address-validator'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { networkSelector } from '../../../../../reducers/settingsSlice'
import { fetchAccountAssets } from '../../../../../reducers/assetSlice'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import {
  checkAmountAndHasError,
  checkMemoAndHasError
} from '../../../../../utils/errorCheck'
import { fetchWithdrawals } from '../../../../../reducers/crosschainSlice'
import { isDemoSelector } from '../../../../../selectors'
import { accountIdSelector } from '../../../../selectors/assets'
import { getChainx } from '../../../../../services/chainx'

export default function({ handleClose }) {
  const network = useSelector(networkSelector)
  const dispatch = useDispatch()
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)
  const accountId = useSelector(accountIdSelector)

  const [address, setAddress] = useState('')
  const [addressErrMsg, setAddressErrMsg] = useState('')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const { free, precision } = useSelector(xbtcFreeSelector)

  const [memo, setMemo] = useState('')
  const [memoErrMsg, setMemoErrMsg] = useState('')

  useEffect(() => {
    dispatch(fetchBtcWithdrawLimit())
  }, [dispatch])

  const limit = useSelector(btcWithdrawLimitSelector)

  let actual = null
  if (amount && !amountErrMsg && limit && typeof precision !== 'undefined') {
    actual = BigNumber(amount)
      .minus(BigNumber(limit.fee).dividedBy(Math.pow(10, precision)))
      .toNumber()
  }

  const [disabled, setDisabled] = useState(false)

  const validBtcAddress = () => {
    if (!address) {
      setAddressErrMsg('必填')
      return false
    }

    const valid = WAValidator.validate(
      address,
      'BTC',
      network === 'testnet' ? 'testnet' : 'prod'
    )
    if (!valid) {
      setAddressErrMsg('地址格式错误')
      return false
    } else if (!['1', '3'].includes(address[0]) && network === 'mainnet') {
      setAddressErrMsg('提现的BTC地址必须以1或3开头')
      return false
    }

    return true
  }

  const sign = async () => {
    if (!validBtcAddress()) {
      return
    }

    if (checkAmountAndHasError(amount, free, precision, setAmountErrMsg)) {
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()

    if (checkMemoAndHasError(memo, setMemoErrMsg)) {
      return
    }

    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    const chainx = getChainx()

    setDisabled(true)
    try {
      const extrinsic = chainx.asset.withdraw(
        'BTC',
        realAmount,
        address,
        memo ? memo.trim() : null
      )
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )
      const messages = {
        successTitle: $t('NOTIFICATION_WITHDRAWAL_SUCCESS'),
        failTitle: $t('NOTIFICATION_WITHDRAWAL_FAIL'),
        successMessage: `${$t('NOTIFICATION_WITHDRAWAL_AMOUNT')} ${amount} BTC`,
        failMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      handleClose()
      await retry(
        () => {
          dispatch(fetchAccountAssets(accountAddress))
          dispatch(fetchWithdrawals(accountId))
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
      open
      title={$t('ASSET_CROSS_CHAIN_WITHDRAWAL_2')}
      handleClose={handleClose}
    >
      <main className="content">
        <SelectInput
          value={address}
          placeholder={$t('ASSET_WITHDRAWAL_BTC_ADDR')}
          onChange={value => {
            setAddressErrMsg('')
            setAddress(value)
          }}
          error={!!addressErrMsg}
          errorText={addressErrMsg}
        />

        <div className="amount">
          <div>
            <AmountInput
              value={amount}
              onChange={value => {
                setAmountErrMsg('')
                setAmount(value)
              }}
              placeholder={$t('ASSET_WITHDRAWAL_AMOUNT')}
              precision={precision}
              error={!!amountErrMsg}
              errorText={amountErrMsg}
            />
          </div>
          {precision ? (
            <div>
              <Label>{$t('ASSET_BALANCE')}</Label>
              <Value>{toPrecision(free, precision)} X-BTC</Value>
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

        <div className="warning">
          <div className="left">
            {network !== 'testnet' && (
              <p>
                <img src={infoIcon} alt="info" />
                <span>{$t('ASSET_WITHDRAWAL_REQU_ADDR')}</span>
              </p>
            )}
            <p>
              <img src={infoIcon} alt="info" />
              <span>{$t('ASSET_WITHDRAWAL_INFO_DEAL_TIME')}</span>
            </p>
          </div>
          <div className="right">
            <p>
              <img src={infoIcon} alt="info" />
              <span>{$t('ASSET_WITHDRAWAL__REQU_AMOUNT')}</span>
            </p>
          </div>
        </div>

        <div className="fee">
          <h3 className="title">
            <span>{$t('ASSET_WITHDRAWAL_FEE')}</span>
            <span>{$t('ASSET_WITHDRAWAL_FINAL_AMOUNT')}</span>
          </h3>
          <p className="content">
            <span>
              {limit
                ? `${toPrecision(limit.fee, precision, false)} X-BTC`
                : null}
            </span>
            <span>{actual ? `${actual} X-BTC` : '--'}</span>
          </p>
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
      </main>
    </StyledDialog>
  )
}
