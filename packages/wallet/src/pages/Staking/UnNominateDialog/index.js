import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import $t from '../../../locale'
import { canRequestSign, retry, toPrecision } from '../../../utils'
import arrow from '../svg/arrow.svg'
import darkArrow from '../svg/dark-arrow.svg'
import BigNumber from 'bignumber.js'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'
import { fetchChainx2NativeAssetInfo } from '../../../reducers/assetSlice'
import { checkAmountAndHasError } from '../../../utils/errorCheck'
import { isDemoSelector } from '../../../selectors'
import {
  setUnNominateOpen,
  unNominateOpenSelector,
  unNominationDataSelector
} from '../../../reducers/runStatusSlice'
import {
  bondingDaysSelector,
  intentionBondingDaysSelector,
  isUnNominationFromSelfIntention
} from './selectors'
import { pcxPrecisionSelector } from '@reducers/assetSlice'
import {
  fetchAccountNominations,
  fetchValidators
} from '@reducers/validatorSlice'

export default function() {
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')
  const precision = useSelector(pcxPrecisionSelector)

  const [disabled, setDisabled] = useState(false)
  const hasAmount = !amountErrMsg && amount
  const dispatch = useDispatch()

  const unNominationData = useSelector(unNominationDataSelector)
  const target = unNominationData && unNominationData.target
  const nomination = unNominationData && unNominationData.nomination
  const revocations = unNominationData ? unNominationData.revocations || [] : []

  const isUnNominateFromSelf = useSelector(isUnNominationFromSelfIntention)

  const bondingDays = useSelector(
    isUnNominateFromSelf ? intentionBondingDaysSelector : bondingDaysSelector
  )

  const unNominateOpen = useSelector(unNominateOpenSelector)

  const handleClose = () => {
    dispatch(setUnNominateOpen(false))
  }

  const unNominate = async () => {
    if (
      checkAmountAndHasError(amount, nomination, precision, setAmountErrMsg)
    ) {
      return
    }

    if (!canRequestSign()) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()

    setDisabled(true)
    try {
      const status = await signAndSendExtrinsic(accountAddress, {
        section: 'xStaking',
        method: 'unbond',
        params: [target, realAmount]
      })

      console.log('status', status)

      const messages = {
        successTitle: $t('NOTIFICATION_UN_NOMINATION_SUCCESS'),
        failTitle: $t('NOTIFICATION_UN_NOMINATION_FAIL'),
        successMessage: `${$t(
          'NOTIFICATION_UN_NOMINATION_AMOUNT'
        )} ${amount} PCX，${$t('NOTIFICATION_UN_NOMINATION_LOCK')}`,
        failMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`
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
    <StyledDialog
      open={unNominateOpen}
      title={$t('STAKING_REVOKE_VOTES')}
      handleClose={handleClose}
    >
      <main className="content">
        <div className="amount">
          <AmountInput
            value={amount}
            onChange={value => {
              setAmountErrMsg('')
              setAmount(value)
            }}
            placeholder={$t('COMMON_AMOUNT')}
            precision={precision}
            error={!!amountErrMsg}
            errorText={amountErrMsg}
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
                    nomination - amount * Math.pow(10, precision),
                    precision
                  )} PCX`}
            </p>
          </section>
        </div>

        <ul className="warning">
          <li>{$t('STAKING_LOCK_DAYS', { days: bondingDays })}</li>
          {revocations.length >= 7 ? (
            <li>
              {$t('STAKING_REVOCATION_LIMIT', { amount: revocations.length })}
            </li>
          ) : null}
        </ul>

        <div>
          <PrimaryButton
            disabled={isDemoAddr || disabled}
            size="fullWidth"
            onClick={unNominate}
          >
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </main>
    </StyledDialog>
  )
}
