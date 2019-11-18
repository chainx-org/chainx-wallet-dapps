import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton, TextInput } from '@chainx/ui'
import $t from '../../../locale'
import { Label, Value } from '../../AssetManagement/components'
import { toPrecision } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { pcxFreeSelector } from '../../AssetManagement/PcxCard/selectors'
import {
  fetchNominationRecords,
  nominationRecordsSelector
} from '../../../reducers/intentionSlice'
import arrow from '../svg/arrow.svg'
import darkArrow from '../svg/dark-arrow.svg'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'
import BigNumber from 'bignumber.js'
import { fetchAccountAssets } from '../../../reducers/assetSlice'

export default function({ handleClose, intention }) {
  const accountAddress = useSelector(addressSelector)
  const nominationRecords = useSelector(nominationRecordsSelector)

  const record = (nominationRecords || []).find(
    record => record.intention === intention.account
  )
  let nomination = 0
  if (record) {
    nomination = record.info.nomination
  }

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')
  const dispatch = useDispatch()

  const [memo, setMemo] = useState('')
  const [memoErrMsg, setMemoErrMsg] = useState('')

  const { free, precision } = useSelector(pcxFreeSelector)

  const [disabled, setDisabled] = useState(false)

  const hasAmount = !amountErrMsg && amount

  const sign = () => {
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

    if ((memo || '').length > 64) {
      setMemoErrMsg($t('COMMON_TOO_LONG'))
      return
    }

    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    setDisabled(true)
    signAndSendExtrinsic(accountAddress, 'xStaking', 'nominate', [
      intention.account,
      realAmount,
      memo
    ])
      .then(status => {
        const messages = {
          successTitle: '投票成功',
          failTitle: '投票失败',
          successMessage: `投票数量 ${amount} PCX`,
          failMessage: `交易hash ${status.txHash}`
        }

        return showSnack(status, messages, dispatch)
      })
      .then(() => {
        handleClose()
        dispatch(fetchNominationRecords(accountAddress))
        dispatch(fetchAccountAssets(accountAddress))
      })
      .catch(() => setDisabled(false))
  }

  return (
    <StyledDialog open title={'投票'} handleClose={handleClose}>
      <main className="content">
        <div className="amount">
          <div>
            <AmountInput
              value={amount}
              onChange={value => {
                setAmountErrMsg('')
                setAmount(value)
              }}
              placeholder={$t('STAKING_VOTE_AMOUNT')}
              precision={precision}
              error={!!amountErrMsg}
              errorText={amountErrMsg}
            />
          </div>
          {precision ? (
            <div>
              <Label>{$t('ASSET_BALANCE')}</Label>
              <Value>{toPrecision(free, precision)} PCX</Value>
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
            placeholder={$t('COMMON_MEMO')}
            error={!!memoErrMsg}
            errorText={memoErrMsg}
          />
        </div>

        <div className="info">
          <section className="now">
            <h4>当前票数</h4>
            <p>{toPrecision(nomination, precision)} PCX</p>
          </section>
          <img src={hasAmount ? arrow : darkArrow} alt="arrow" />
          <section className="after">
            <h4>修改后票数</h4>
            <p>
              {!hasAmount
                ? '-'
                : `${toPrecision(
                    nomination + amount * Math.pow(10, precision),
                    precision
                  )} PCX`}
            </p>
          </section>
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
