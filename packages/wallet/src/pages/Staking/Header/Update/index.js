import React, { useState } from 'react'
import updateIcon from './update.svg'
import { IconWrapper } from '../components'
import UpdateNodeDialog from './UpdateNodeDialog'
import ReactTooltip from 'react-tooltip'

export default function() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconWrapper onClick={() => setOpen(true)}>
        <img src={updateIcon} alt="register" data-tip="更新节点" />
        <ReactTooltip place="bottom" type="dark" effect="solid" />
      </IconWrapper>
      {open ? <UpdateNodeDialog handleClose={() => setOpen(false)} /> : null}
    </>
  )
}
