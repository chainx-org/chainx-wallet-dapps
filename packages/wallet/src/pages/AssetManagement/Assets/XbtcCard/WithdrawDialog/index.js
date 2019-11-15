import React, { useEffect, useState } from 'react'
import { Label, Value } from '../../../components'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton, SelectInput, TextInput } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import { xbtcFreeSelector } from '../selectors'
import $t from '../../../../../locale'
import { toPrecision } from '../../../../../utils'
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

export default function({ handleClose }) {
  const network = useSelector(networkSelector)
  const dispatch = useDispatch()
  const accountAddress = useSelector(addressSelector)
  const [address, setAddress] = useState('')
  const [addressErrMsg, setAddressErrMsg] = useState('')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const { free, precision } = useSelector(xbtcFreeSelector)

  const [memo, setMemo] = useState('')

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

  const sign = () => {
    if (!validBtcAddress()) {
      return
    }

    if (!amount) {
      setAmountErrMsg('必填')
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()

    if (realAmount > free) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_ERROR'))
      return
    }

    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    setDisabled(true)
    signAndSendExtrinsic(accountAddress, 'xAssetsProcess', 'withdraw', [
      'BTC',
      realAmount,
      address,
      memo ? memo.trim() : null
    ])
      .then(status => {
        const messages = {
          successTitle: '提现成功',
          failTitle: '提现失败',
          successMessage: `提现数量 ${amount} BTC`,
          failMessage: `交易hash ${status.txHash}`
        }

        return showSnack(status, messages, dispatch)
      })
      .then(() => {
        handleClose()
        dispatch(fetchAccountAssets(accountAddress))
      })
      .catch(() => setDisabled(false))
  }

  return (
    <StyledDialog open title={'跨链提现'} handleClose={handleClose}>
      <main className="content">
        <SelectInput
          value={address}
          placeholder="BTC 收款地址"
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
            onChange={setMemo}
            placeholder={$t('COMMON_MEMO')}
          />
        </div>

        <div className="warning">
          <div className="left">
            {network !== 'testnet' && (
              <p>
                <img src={infoIcon} alt="info" />
                <span>仅支持 1 和 3 开头的 BTC地址</span>
              </p>
            )}
            <p>
              <img src={infoIcon} alt="info" />
              <span>提现申请会在 24 小时内处理</span>
            </p>
          </div>
          <div className="right">
            <p>
              <img src={infoIcon} alt="info" />
              <span>最小提现数量为 0.0015</span>
            </p>
          </div>
        </div>

        <div className="fee">
          <h3 className="title">
            <span>提现手续费</span>
            <span>实际到账数量</span>
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
          <PrimaryButton disabled={disabled} size="fullWidth" onClick={sign}>
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </main>
    </StyledDialog>
  )
}
