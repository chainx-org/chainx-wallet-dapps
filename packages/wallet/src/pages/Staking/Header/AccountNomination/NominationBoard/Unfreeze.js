import React from 'react'
import { DefaultButton } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import {
  setUnFreezeOpen,
  unFreezeOpenSelector
} from '../../../../../reducers/runStatusSlice'
import $t from '../../../../../locale'
import { setUnFreezeData } from '@reducers/runStatusSlice'

export default function({ record, revocations }) {
  const unFreezeOpen = useSelector(unFreezeOpenSelector)
  const dispatch = useDispatch()

  return (
    <>
      <DefaultButton
        size="small"
        style={{ marginRight: 8 }}
        disabled={revocations.length <= 0 || unFreezeOpen}
        onClick={() => {
          dispatch(setUnFreezeOpen(true))
          dispatch(
            setUnFreezeData({
              account: record.account,
              revocations
            })
          )
        }}
      >
        {$t('COMMON_UNFREEZE')}
      </DefaultButton>
    </>
  )
}
