import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton, TextInput } from '@chainx/ui'
import $t from '../../../locale'
import { Label, Value } from '../../AssetManagement/components'
import { toPrecision } from '../../../utils'
import { useSelector } from 'react-redux'
import { pcxFreeSelector } from '../../AssetManagement/PcxCard/selectors'
import { nominationRecordsSelector } from '../../../reducers/intentionSlice'
import arrow from './arrow.svg'

export default function({ handleClose, intention }) {
  const nominationRecords = useSelector(nominationRecordsSelector)
  console.log('nominationRecords', nominationRecords)
  console.log('intention', intention)

  const record = (nominationRecords || []).find(
    record => record.intention === intention.account
  )
  let nomination = 0
  if (record) {
    nomination = record.info.nomination
  }

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const [memo, setMemo] = useState('')

  const { free, precision } = useSelector(pcxFreeSelector)

  const [disabled, setDisabled] = useState(false)
  console.log(setDisabled)

  const hasAmount = !amountErrMsg && amount

  const sign = () => {
    if (!amount) {
      setAmountErrMsg('必填')
      return
    }

    if (amount * Math.pow(10, precision) > free) {
      setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_ERROR'))
      return
    }

    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }
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
              placeholder={$t('ASSET_TRANSFER_AMOUNT')}
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
            onChange={setMemo}
            placeholder={$t('COMMON_MEMO')}
          />
        </div>

        <div className="info">
          <section className="now">
            <h4>当前票数</h4>
            <p>{toPrecision(nomination, precision)} PCX</p>
          </section>
          <img src={arrow} alt="arrow" />
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
