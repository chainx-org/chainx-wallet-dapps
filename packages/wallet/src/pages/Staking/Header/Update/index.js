import React, { useState } from 'react'
import updateIcon from './update.svg'
import { IconWrapper } from '../components'
import UpdateNodeDialog from './UpdateNodeDialog'
import ReactTooltip from 'react-tooltip'
import $t from '../../../../locale'

export default function() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconWrapper onClick={() => setOpen(true)}>
        <img
          src={updateIcon}
          alt="register"
          data-tip={$t('STAKING_UPDATE_INTENTION')}
        />
        <ReactTooltip place="bottom" type="dark" effect="solid" />
      </IconWrapper>
      {open ? <UpdateNodeDialog handleClose={() => setOpen(false)} /> : null}
    </>
  )
}
