import React, { useState } from 'react'
import { BetAmount, StyledDialog } from './styledComponents'
import { useDispatch, useSelector } from 'react-redux'
import {
  betOddSelector,
  setOpenBetBtcDialog
} from '../../../reducers/runStatusSlice'
import { AmountInput, PrimaryButton } from '@chainx/ui'
import $t from '../../../locale'
import { Label, Value } from '../../AssetManagement/components'
import { toPrecision } from '../../../utils'
import { pcxFreeSelector } from '../../AssetManagement/PcxCard/selectors'

export default function() {
  const dispatch = useDispatch()
  const closeDialog = () => {
    dispatch(setOpenBetBtcDialog({ open: false }))
  }

  const betOdd = useSelector(betOddSelector)
  const amounts = [1, 10, 20, 50, 100, 200, 500, 1000]

  const [useDefaultAmount, setUseDefaultAmount] = useState(true)
  const [activeDefault, setActiveDefault] = useState(amounts[0])
  const [amount, setAmount] = useState('')
  const { free: pcxFree, precision } = useSelector(pcxFreeSelector) || {}

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

  const bet = () => {
    console.log(useDefaultAmount ? activeDefault : parseFloat(amount))
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
        <p className="others">其它金额</p>
        <div className="amount">
          <div>
            <AmountInput
              value={amount}
              onChange={setInputAmount}
              placeholder={'0.5 - 1000 PCX'}
              precision={precision}
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
          <PrimaryButton size="fullWidth" onClick={bet}>
            确定
          </PrimaryButton>
        </div>
      </div>
    </StyledDialog>
  )
}
