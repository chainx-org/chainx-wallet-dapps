import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, TextInput } from '@chainx/ui'
import $t from '../../../locale'
import { IntentionSelect } from '../../../components'
import { useSelector } from 'react-redux'
import { pcxPrecisionSelector } from '../../selectors/assets'

export default function({ handleClose, intention }) {
  const [memo, setMemo] = useState('')
  const [targetIntentionName, setTargetIntentionName] = useState('')

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const precision = useSelector(pcxPrecisionSelector)

  return (
    <StyledDialog open title={'切换投票'} handleClose={handleClose}>
      <main className="content">
        <div className="intention">
          <IntentionSelect
            value={targetIntentionName}
            onChange={setTargetIntentionName}
            placeholder={'新节点'}
          />
          <AmountInput
            value={amount}
            onChange={value => {
              setAmountErrMsg('')
              setAmount(value)
            }}
            placeholder={'数量'}
            precision={precision}
            error={!!amountErrMsg}
            errorText={amountErrMsg}
          />
        </div>

        <div>
          <TextInput
            value={memo}
            onChange={setMemo}
            placeholder={$t('COMMON_MEMO')}
          />
        </div>
      </main>
    </StyledDialog>
  )
}
