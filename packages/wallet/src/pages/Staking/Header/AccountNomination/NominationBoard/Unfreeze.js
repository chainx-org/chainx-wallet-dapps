import React, { useState } from 'react'
import { DefaultButton } from '@chainx/ui'
import UnFreezeDialog from './UnfreezeDialog'
import { useDispatch, useSelector } from 'react-redux'
import {
  setUnFreezeOpen,
  unFreezeOpenSelector
} from '../../../../../reducers/runStatusSlice'

export default function({ revocations = [] }) {
  const [disabled, setDisabled] = useState(false)
  const unFreezeOpen = useSelector(unFreezeOpenSelector)
  const dispatch = useDispatch()

  return (
    <>
      <DefaultButton
        size="small"
        style={{ marginRight: 8 }}
        disabled={revocations.length <= 0 || disabled}
        onClick={() => {
          dispatch(setUnFreezeOpen(true))
          setDisabled(true)
        }}
      >
        解冻
      </DefaultButton>
      {unFreezeOpen ? (
        <UnFreezeDialog
          revocations={revocations}
          handleClose={() => {
            dispatch(setUnFreezeOpen(false))
            setDisabled(false)
          }}
        />
      ) : null}
    </>
  )
}
