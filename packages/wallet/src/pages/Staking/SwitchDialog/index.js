import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton } from '@chainx/ui'
import $t from '../../../locale'
import { useDispatch, useSelector } from 'react-redux'
import { retry, toPrecision } from '../../../utils'
import arrow from '../svg/arrow.svg'
import darkArrow from '../svg/dark-arrow.svg'
import BigNumber from 'bignumber.js'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'
import IntentionSelect from './IntentionSelect'
import { fetchNominationRecords } from '../../../reducers/intentionSlice'
import { fetchAccountAssets } from '../../../reducers/assetSlice'
import { isDemoSelector } from '../../../selectors'
import {
  setSwitchNominationOpen,
  switchNominationOpenSelector
} from '../../../reducers/runStatusSlice'
import {
  nextRenominateTimeSelector,
  reachNexRenominateSelector
} from './selectors'
import { switchNominationFromSelector } from '@reducers/runStatusSlice'
import { nominationInfoSelector } from '@reducers/validatorSlice'
import { pcxPrecisionSelector } from '@reducers/assetSlice'
import { nextRenominateHeightSelector } from '@pages/Staking/SwitchDialog/selectors'

export default function() {
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)
  const reachNextRenominate = useSelector(reachNexRenominateSelector)
  const nextRenominateTime = useSelector(nextRenominateTimeSelector)
  const nextRenominateHeight = useSelector(nextRenominateHeightSelector)

  const nominationInfo = useSelector(nominationInfoSelector)

  const switchNominationOpen = useSelector(switchNominationOpenSelector)
  const handleClose = () => dispatch(setSwitchNominationOpen(false))

  const validatorFrom = useSelector(switchNominationFromSelector)
  const nowNomination = nominationInfo[validatorFrom]?.nomination
  const [targetAccount, setTargetAccount] = useState('')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')
  const [intentionErrorMsg, setIntentionErrMsg] = useState('')

  const [disabled, setDisabled] = useState(false)
  const hasAmount = !amountErrMsg && amount

  const dispatch = useDispatch()

  const precision = useSelector(pcxPrecisionSelector)
  let realAmount = 0
  if (amount) {
    realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()
  }

  const checkAmountAndHasError = value => {
    if (isNaN(parseFloat(value))) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_ERROR'))
      return true
    }

    if (realAmount > nowNomination) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_TOO_MUCH_ERROR'))
      return true
    }

    return false
  }

  const checkIntentionAndHasError = () => {
    if (!targetAccount) {
      setIntentionErrMsg('必填')
      return true
    }

    if (targetAccount === validatorFrom) {
      setIntentionErrMsg('不能切换到相同节点')
      return true
    }

    return false
  }

  const switchNominate = async () => {
    if (checkAmountAndHasError(amount)) {
      setDisabled(true)
      return
    }

    if (checkIntentionAndHasError()) {
      setDisabled(true)
      return
    }

    setDisabled(true)
    try {
      const status = await signAndSendExtrinsic(accountAddress, {
        section: 'xStaking',
        method: 'rebond',
        params: [validatorFrom, targetAccount, realAmount]
      })
      const messages = {
        successTitle: $t('NOTIFICATION_SWITCH_SUCCESS'),
        failTitle: $t('NOTIFICATION_SWITCH_FAIL'),
        successMessage: `${$t('NOTIFICATION_SWITCH_AMOUNT')} ${amount} PCX`,
        failMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`
      }

      setDisabled(false)
      await showSnack(status, messages, dispatch)
      handleClose()
      await retry(
        () => {
          dispatch(fetchNominationRecords(accountAddress))
          dispatch(fetchAccountAssets(accountAddress))
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
      open={switchNominationOpen}
      title={'切换投票'}
      handleClose={handleClose}
    >
      <main className="content">
        <div>
          <IntentionSelect
            style={{ marginRight: 8 }}
            value={targetAccount}
            onChange={value => {
              setDisabled(false)
              setIntentionErrMsg('')
              setTargetAccount(value)
            }}
            placeholder={'新节点'}
            error={!!intentionErrorMsg}
            errorText={intentionErrorMsg}
          />
        </div>
        <div>
          <AmountInput
            value={amount}
            onChange={value => {
              setDisabled(false)
              setAmountErrMsg('')
              setAmount(value)
              checkAmountAndHasError(value)
            }}
            placeholder={'数量'}
            precision={precision}
            error={!!amountErrMsg}
            errorText={amountErrMsg}
          />
        </div>

        <div className="info">
          <section className="now">
            <h4>{$t('STAKING_NOW_NOMINATION')}</h4>
            <p>{toPrecision(nowNomination, precision)} PCX</p>
          </section>
          <img src={hasAmount ? arrow : darkArrow} alt="arrow" />
          <section className="after">
            <h4>{$t('STAKING_AFTER_NOMINATION')}</h4>
            <p>
              {!hasAmount
                ? '-'
                : `${toPrecision(
                    nowNomination - amount * Math.pow(10, precision),
                    precision
                  )} PCX`}
            </p>
          </section>
        </div>

        <ul className="warning">
          {reachNextRenominate ? null : (
            <li>
              {$t('STAKING_NEXT_RENOMINATE_WARNING', {
                height: nextRenominateHeight,
                time: nextRenominateTime
              })}
            </li>
          )}
        </ul>

        <div>
          <PrimaryButton
            disabled={isDemoAddr || disabled || !reachNextRenominate}
            size="fullWidth"
            onClick={switchNominate}
          >
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </main>
    </StyledDialog>
  )
}
