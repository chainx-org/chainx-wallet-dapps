import React, { useState } from 'react'
import { BetAmount, StyledDialog } from './styledComponents'
import { useDispatch, useSelector } from 'react-redux'
import {
  betOddSelector,
  setOpenBetBtcDialog
} from '../../../reducers/runStatusSlice'
import { stringCamelCase } from '@chainx/util'
import { AmountInput, PrimaryButton } from '@chainx/ui'
import $t from '../../../locale'
import { Label, Value } from '../../AssetManagement/components'
import { retry, toPrecision } from '../../../utils'
import { pcxFreeSelector } from '../../AssetManagement/PcxCard/selectors'
import {
  fetchBetRecords,
  fetchEvenBets,
  fetchOddBets,
  maxBetSelector,
  minBetSelector
} from '../../../reducers/oddevenSlice'
import { getChainx } from '../../../services/chainx'
import { contractAbi } from '../../../utils/contract'
import { oddEvenContractAddress } from '../../../utils/constants'
import { parseParams } from '../../../utils/contractHelper'
import { addressSelector } from '../../../reducers/addressSlice'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import BigNumber from 'bignumber.js'
import { isDemoSelector } from '../../../selectors'
import { fetchAccountAssets } from '../../../reducers/assetSlice'

export default function() {
  const isDemoAddr = useSelector(isDemoSelector)
  const dispatch = useDispatch()
  const closeDialog = () => {
    dispatch(setOpenBetBtcDialog({ open: false }))
  }

  const betOdd = useSelector(betOddSelector)
  const accountAddress = useSelector(addressSelector)
  const amounts = [1, 10, 20, 30, 50, 60, 80, 100]

  const [useDefaultAmount, setUseDefaultAmount] = useState(true)
  const [activeDefault, setActiveDefault] = useState(amounts[0])
  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')
  const { free: pcxFree, precision } = useSelector(pcxFreeSelector) || {}
  const [disabled, setDisabled] = useState(false)

  const maxBet = useSelector(maxBetSelector)
  const minBet = useSelector(minBetSelector)

  const maxPcx = toPrecision(maxBet, precision, false)
  const minPcx = toPrecision(minBet, precision, false)

  const selectDefault = amount => {
    if (!amounts.includes(amount)) {
      return
    }

    setUseDefaultAmount(true)
    setActiveDefault(amount)
    setAmount('')
  }

  const setInputAmount = value => {
    setUseDefaultAmount(false)
    setAmountErrMsg('')
    setAmount(value)
  }

  const bet = async () => {
    const targetAmount = useDefaultAmount ? activeDefault : amount
    if (isNaN(parseFloat(targetAmount))) {
      setAmountErrMsg($t('COMMON_AMOUNT_ERROR'))
      return
    }

    const realAmount = BigNumber(targetAmount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()

    if (realAmount < minBet || realAmount > maxBet) {
      setAmountErrMsg($t('COMMON_AMOUNT_ERROR'))
      return
    }

    const method = 'bet'
    const parity = !betOdd
    const params = [parity]
    parseParams(contractAbi.messages[stringCamelCase(method)].args, params)
    const args = [
      oddEvenContractAddress,
      realAmount,
      500000,
      contractAbi.messages[stringCamelCase(method)](...params)
    ]

    setDisabled(true)
    try {
      const ex = getChainx().api.tx.xContracts.call(...args)
      const status = await signAndSendExtrinsic(accountAddress, ex.toHex())

      const messages = {
        successTitle: $t('COMMON_MSG_SUCCESS', { msg: $t('PREDICT_BET') }),
        failTitle: $t('COMMON_MSG_Fail', { msg: $t('PREDICT_BET') }),
        successMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`,
        failMessage: `${$t('NOTIFICATION_TX_HASH')} ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      closeDialog()
      retry(
        () => {
          Promise.all([
            dispatch(fetchOddBets(accountAddress)),
            dispatch(fetchEvenBets(accountAddress)),
            dispatch(fetchBetRecords(accountAddress)),
            dispatch(fetchAccountAssets(accountAddress))
          ])
        },
        5,
        2
      ).then(() => console.log('Refresh assets 5 times after transfer'))
    } finally {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog
      title={$t(betOdd ? 'PREDICT_BET_ODD' : 'PREDICT_BET_EVEN')}
      open
      handleClose={closeDialog}
    >
      <div className="wrapper">
        <p>{$t('PREDICT_DEFAULT_AMOUNT')}</p>
        <ol>
          {amounts.map((amount, index) => {
            return (
              <li key={index}>
                <BetAmount
                  onClick={() => selectDefault(amount)}
                  active={useDefaultAmount && activeDefault === amount}
                >
                  {amount} PCX
                </BetAmount>
              </li>
            )
          })}
        </ol>
        <p className="others">
          {$t('PREDICT_OTHER_AMOUNT')}({toPrecision(maxBet, precision, false)}{' '}
          PCX max)
        </p>
        <div className="amount">
          <div>
            <AmountInput
              value={amount}
              onChange={setInputAmount}
              placeholder={`${minPcx} - ${maxPcx} PCX`}
              precision={precision}
              error={!!amountErrMsg}
              errorText={amountErrMsg}
            />
          </div>
          {precision && (
            <div>
              <Label>{$t('COMMON_FREE')}</Label>
              <Value>{toPrecision(pcxFree, precision)} PCX</Value>
            </div>
          )}
        </div>

        <div className="buttons-line">
          <PrimaryButton
            disabled={isDemoAddr || disabled}
            size="fullWidth"
            onClick={bet}
          >
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </div>
    </StyledDialog>
  )
}
