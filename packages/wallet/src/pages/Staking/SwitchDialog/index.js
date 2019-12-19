import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton, TextInput } from '@chainx/ui'
import $t from '../../../locale'
import { useDispatch, useSelector } from 'react-redux'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { retry, toPrecision } from '../../../utils'
import arrow from '../svg/arrow.svg'
import darkArrow from '../svg/dark-arrow.svg'
import BigNumber from 'bignumber.js'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'
import IntentionSelect from './IntentionSelect'
import {
  fetchNominationRecords,
  intentionsSelector
} from '../../../reducers/intentionSlice'
import { fetchAccountAssets } from '../../../reducers/assetSlice'
import { checkMemoAndHasError } from '../../../utils/errorCheck'
import { isDemoSelector } from '../../../selectors'
import { getChainx } from '../../../services/chainx'

export default function({ handleClose, nomination, intention }) {
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)

  const [memo, setMemo] = useState('')
  const [memoErrMsg, setMemoErrMsg] = useState('')
  const [targetIntentionName, setTargetIntentionName] = useState('')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')
  const [intentionErrorMsg, setIntentionErrMsg] = useState('')

  const [disabled, setDisabled] = useState(false)
  const hasAmount = !amountErrMsg && amount

  const intentions = useSelector(intentionsSelector)
  const targetIntention = (intentions || []).find(
    item => item.name === targetIntentionName
  )
  const dispatch = useDispatch()

  const precision = useSelector(pcxPrecisionSelector)
  let realAmount = 0
  if (amount) {
    realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()
  }

  const chainx = getChainx()

  const checkAmountAndHasError = value => {
    if (isNaN(parseFloat(value))) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_ERROR'))
      return true
    }

    if (realAmount > nomination) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_TOO_MUCH_ERROR'))
      return true
    }

    return false
  }

  const checkIntentionAndHasError = () => {
    if (!targetIntention) {
      setIntentionErrMsg('必填')
      return true
    }

    if (targetIntention.account === intention.account) {
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

    if (
      checkMemoAndHasError(memo, setMemoErrMsg, setDisabled.bind(null, true))
    ) {
      return
    }

    setDisabled(true)
    try {
      const extrinsic = chainx.stake.renominate(
        intention.account,
        targetIntention.account,
        realAmount,
        memo
      )
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )
      const messages = {
        successTitle: $t('NOTIFICATION_SWITCH_SUCCESS'),
        failTitle: $t('NOTIFICATION_SWITCH_FAIL'),
        successMessage: `${$t('NOTIFICATION_SWITCH_AMOUNT')} ${amount} PCX`,
        failMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`
      }

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
    <StyledDialog open title={'切换投票'} handleClose={handleClose}>
      <main className="content">
        <div className="intention">
          <div>
            <IntentionSelect
              style={{ marginRight: 8 }}
              value={targetIntentionName}
              onChange={value => {
                setDisabled(false)
                setIntentionErrMsg('')
                setTargetIntentionName(value)
              }}
              placeholder={'新节点'}
              error={!!intentionErrorMsg}
              errorText={intentionErrorMsg}
            />
          </div>
          <div>
            <AmountInput
              style={{ marginLeft: 8 }}
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
                    nomination - amount * Math.pow(10, precision),
                    precision
                  )} PCX`}
            </p>
          </section>
        </div>

        <div>
          <PrimaryButton
            disabled={isDemoAddr || disabled}
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
