import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton } from '@chainx/ui'
import $t from '../../../locale'
import { Label, Value } from '../../AssetManagement/components'
import { canRequestSign, retry, toPrecision } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { nominationRecordsSelector } from '../../../reducers/intentionSlice'
import arrow from '../svg/arrow.svg'
import darkArrow from '../svg/dark-arrow.svg'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'
import { isDemoSelector } from '../../../selectors'
import BigNumber from 'bignumber.js'
import {
  pcxFreeSelector,
  pcxPrecisionSelector
} from '../../../reducers/assetSlice'
import { checkAmountAndHasError } from '../../../utils/errorCheck'
import {
  setVoteOpen,
  voteIntentionSelector,
  voteOpenSelector
} from '../../../reducers/runStatusSlice'
import {
  fetchAccountNominations,
  fetchValidators
} from '@reducers/validatorSlice'
import { fetchChainx2NativeAssetInfo } from '@reducers/assetSlice'

export default function() {
  const accountAddress = useSelector(addressSelector)
  const nominationRecords = useSelector(nominationRecordsSelector)
  const isDemoAddr = useSelector(isDemoSelector)
  const voteOpen = useSelector(voteOpenSelector)

  const intention = useSelector(voteIntentionSelector) || {}

  const isVoteSelf = intention.account === accountAddress
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

  const pcxFree = useSelector(pcxFreeSelector)
  const precision = useSelector(pcxPrecisionSelector)

  const [disabled, setDisabled] = useState(false)
  const hasAmount = !amountErrMsg && amount

  const sign = async () => {
    if (checkAmountAndHasError(amount, pcxFree, precision, setAmountErrMsg)) {
      return
    }

    if (!canRequestSign()) {
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toString()

    const upperLimit = new BigNumber(intention.selfBonded).multipliedBy(10)
    const afterVote = new BigNumber(intention.total).plus(realAmount)
    if (!isVoteSelf && upperLimit.isLessThan(afterVote)) {
      setAmountErrMsg($t('STAKING_TOO_MUCH_NOMINATION'))
      return
    }

    setDisabled(true)
    try {
      const status = await signAndSendExtrinsic(accountAddress, {
        section: 'xStaking',
        method: 'bond',
        params: [intention.account, realAmount]
      })
      const messages = {
        successTitle: $t('NOTIFICATION_VOTE_SUCCESS'),
        failTitle: $t('NOTIFICATION_VOTE_FAIL'),
        successMessage: `${$t('NOTIFICATION_VOTE_AMOUNT')} ${amount} PCX`,
        failMessage: ``
      }

      setDisabled(false)
      await showSnack(status, messages, dispatch)
      handleClose()
      await retry(
        () => {
          dispatch(fetchChainx2NativeAssetInfo(accountAddress))
          dispatch(fetchValidators())
          dispatch(fetchAccountNominations(accountAddress))
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
              <Value>{toPrecision(pcxFree, precision)} PCX</Value>
            </div>
          ) : null}
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
