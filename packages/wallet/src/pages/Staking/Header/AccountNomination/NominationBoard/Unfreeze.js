import React, { useState } from 'react'
import { DefaultButton } from '@chainx/ui'
import UnFreezeDialog from './UnfreezeDialog'

export default function({ revocations = [] }) {
  const [unfreezeOpen, setUnfreezeOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <>
      <DefaultButton
        size="small"
        style={{ marginRight: 8 }}
        disabled={revocations.length <= 0 || disabled}
        onClick={() => {
          setUnfreezeOpen(true)
          setDisabled(true)
        }}
      >
        解冻
      </DefaultButton>
      {unfreezeOpen ? (
        <UnFreezeDialog
          revocations={revocations}
          handleClose={() => {
            setUnfreezeOpen(false)
            setDisabled(false)
          }}
        />
      ) : null}
    </>
  )
}
