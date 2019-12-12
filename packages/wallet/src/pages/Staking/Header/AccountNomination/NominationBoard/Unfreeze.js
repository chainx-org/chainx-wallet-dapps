import React, { useState } from 'react'
import { DefaultButton } from '@chainx/ui'
import UnFreezeDialog from './UnfreezeDialog'
import { useDispatch, useSelector } from 'react-redux'
import {
  setUnFreezeOpen,
  unFreezeOpenSelector
} from '../../../../../reducers/runStatusSlice'
import $t from '../../../../../locale'

export default function({ record }) {
  const [disabled, setDisabled] = useState(false)
  const unFreezeOpen = useSelector(unFreezeOpenSelector)
  const dispatch = useDispatch()

  return (
    <>
      <DefaultButton
        size="small"
        style={{ marginRight: 8 }}
        disabled={record.info.revocations.length <= 0 || disabled}
        onClick={() => {
          dispatch(setUnFreezeOpen(true))
          setDisabled(true)
        }}
      >
        {$t('COMMON_UNFREEZE')}
      </DefaultButton>
      {unFreezeOpen ? (
        <UnFreezeDialog
          record={record}
          revocations={record.info.revocations}
          handleClose={() => {
            dispatch(setUnFreezeOpen(false))
            setDisabled(false)
          }}
        />
      ) : null}
    </>
  )
}
