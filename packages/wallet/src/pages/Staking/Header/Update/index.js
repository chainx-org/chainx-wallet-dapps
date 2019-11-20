import React, { useState } from 'react'
import updateIcon from './update.svg'
import { IconWrapper } from '../components'
import UpdateNodeDialog from './UpdateNodeDialog'

export default function() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconWrapper onClick={() => setOpen(true)}>
        <img src={updateIcon} alt="register" />
      </IconWrapper>
      {open ? <UpdateNodeDialog handleClose={() => setOpen(false)} /> : null}
    </>
  )
}
