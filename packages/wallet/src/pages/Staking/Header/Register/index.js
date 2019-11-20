import React, { useState } from 'react'
import registerIcon from './register.svg'
import RegisterNodeDialog from './RegisterNodeDialog'
import { IconWrapper } from '../components'

export default function() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconWrapper onClick={() => setOpen(true)}>
        <img src={registerIcon} alt="register" />
      </IconWrapper>
      {open ? <RegisterNodeDialog handleClose={() => setOpen(false)} /> : null}
    </>
  )
}
