import React from 'react'
import { DefaultButton } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import {
  setUnFreezeOpen,
  setUnFreezeRecord,
  unFreezeOpenSelector
} from '../../../../../reducers/runStatusSlice'
import $t from '../../../../../locale'

export default function({ record }) {
  const unFreezeOpen = useSelector(unFreezeOpenSelector)
  const dispatch = useDispatch()

  return (
    <>
      <DefaultButton
        size="small"
        style={{ marginRight: 8 }}
        disabled={record.info.revocations.length <= 0 || unFreezeOpen}
        onClick={() => {
          dispatch(setUnFreezeOpen(true))
          dispatch(setUnFreezeRecord(record))
        }}
      >
        {$t('COMMON_UNFREEZE')}
      </DefaultButton>
    </>
  )
}
