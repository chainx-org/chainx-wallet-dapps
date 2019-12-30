import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton, TextInput } from '@chainx/ui'
import $t from '../../../locale'
import { Label, Value } from '../../AssetManagement/components'
import { retry, toPrecision } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { pcxFreeSelector } from '../../AssetManagement/PcxCard/selectors'
import {
  fetchIntentions,
  fetchNominationRecords,
  nominationRecordsSelector
} from '../../../reducers/intentionSlice'
import arrow from '../svg/arrow.svg'
import darkArrow from '../svg/dark-arrow.svg'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'
import { isDemoSelector } from '../../../selectors'
import BigNumber from 'bignumber.js'
import { fetchAccountAssets } from '../../../reducers/assetSlice'
import {
  checkAmountAndHasError,
  checkMemoAndHasError
} from '../../../utils/errorCheck'
import { getChainx } from '../../../services/chainx'
import {
  setVoteOpen,
  voteIntentionSelector,
  voteOpenSelector
} from '../../../reducers/runStatusSlice'

export default function() {
  const accountAddress = useSelector(addressSelector)
  const nominationRecords = useSelector(nominationRecordsSelector)
  const isDemoAddr = useSelector(isDemoSelector)
  const voteOpen = useSelector(voteOpenSelector)

  const intention = useSelector(voteIntentionSelector) || {}
  const handleClose = () => dispatch(setVoteOpen(false))

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

  const { free, precision } = useSelector(pcxFreeSelector) || {}

  const [disabled, setDisabled] = useState(false)

  const hasAmount = !amountErrMsg && amount
  const chainx = getChainx()

  const sign = async () => {
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
      const extrinsic = chainx.stake.nominate(
        intention.account,
        realAmount,
        memo
      )
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )
      const messages = {
        successTitle: $t('NOTIFICATION_VOTE_SUCCESS'),
        failTitle: $t('NOTIFICATION_VOTE_FAIL'),
        successMessage: `${$t('NOTIFICATION_VOTE_AMOUNT')} ${amount} PCX`,
        failMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`
      }

      setDisabled(false)
      await showSnack(status, messages, dispatch)
      handleClose()
      await retry(
        () => {
          dispatch(fetchNominationRecords(accountAddress))
          dispatch(fetchAccountAssets(accountAddress))
          dispatch(fetchIntentions())
        },
        5,
        2
      )
    } catch (e) {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog open={voteOpen} title={'投票'} handleClose={handleClose}>
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
            multiline={true}
            rows={2}
            placeholder={$t('COMMON_MEMO')}
            error={!!memoErrMsg}
            errorText={memoErrMsg}
          />
        </div>

        <div className="info">
          <section className="now">
            <h4>{$t('STAKING_NOW_NOMINATION')}</h4>
            <p>{toPrecision(nomination, precision)} PCX</p>
          </section>
          <img src={hasAmount ? arrow : darkArrow} alt="arrow" />
          <section className="after">
            <h4>{$t('STAKING_AFTER_NOMINATION')}</h4>
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
