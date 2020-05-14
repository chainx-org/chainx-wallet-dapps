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
import { toPrecision } from '../../../utils'
import { pcxFreeSelector } from '../../AssetManagement/PcxCard/selectors'
import { maxBetSelector } from '../../../reducers/oddevenSlice'
import { getChainx } from '../../../services/chainx'
import { contractAbi } from '../../../utils/contract'
import { oddEvenContractAddress } from '../../../utils/constants'
import { parseParams } from '../../../utils/contractHelper'
import { addressSelector } from '../../../reducers/addressSlice'
import { signAndSendExtrinsic } from '../../../utils/chainxProvider'
import BigNumber from 'bignumber.js'
import { isDemoSelector } from '../../../selectors'

export default function() {
  const isDemoAddr = useSelector(isDemoSelector)
  const dispatch = useDispatch()
  const closeDialog = () => {
    dispatch(setOpenBetBtcDialog({ open: false }))
  }

  const betOdd = useSelector(betOddSelector)
  const accountAddress = useSelector(addressSelector)
  const amounts = [1, 10, 20, 50, 100, 200, 500, 1000]

  const [useDefaultAmount, setUseDefaultAmount] = useState(true)
  const [activeDefault, setActiveDefault] = useState(amounts[0])
  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')
  const { free: pcxFree, precision } = useSelector(pcxFreeSelector) || {}
  const [disabled, setDisabled] = useState(false)

  const maxBet = useSelector(maxBetSelector)

  const maxPcx = toPrecision(maxBet, precision, false)

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
    setAmount(value)
  }

  const bet = async () => {
    if (isNaN(parseFloat(amount))) {
      setAmountErrMsg($t('COMMON_AMOUNT_ERROR'))
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()

    const method = 'bet'
    const parity = !betOdd
    const params = [parity, realAmount]
    parseParams(contractAbi.messages[stringCamelCase(method)].args, params)
    const args = [
      oddEvenContractAddress,
      0,
      500000,
      contractAbi.messages[stringCamelCase(method)](...params)
    ]

    setDisabled(true)
    try {
      const ex = getChainx().api.tx.xContracts.call(...args)
      const status = await signAndSendExtrinsic(accountAddress, ex.toHex())

      console.log('status', status)
    } finally {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog
      title={`投注${betOdd ? '奇' : '偶'}数`}
      open
      handleClose={closeDialog}
    >
      <div className="wrapper">
        <p>投注金额</p>
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
          其它金额({toPrecision(maxBet, precision, false)} PCX max)
        </p>
        <div className="amount">
          <div>
            <AmountInput
              value={amount}
              onChange={setInputAmount}
              placeholder={`0.5 - ${maxPcx} PCX`}
              precision={precision}
              error={!!amountErrMsg}
              errorText={amountErrMsg}
            />
          </div>
          {precision && (
            <div>
              <Label>{$t('ASSET_BALANCE')}</Label>
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
