import React, { useState } from 'react'
import registerIcon from './register.svg'
import RegisterNodeDialog from './RegisterNodeDialog'
import { IconWrapper } from '../components'
import ReactTooltip from 'react-tooltip'
import $t from '../../../../locale'

export default function() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconWrapper onClick={() => setOpen(true)}>
        <img
          src={registerIcon}
          alt="register"
          data-tip={$t('STAKING_REGISTER_INTENTION')}
        />
        <ReactTooltip place="bottom" type="dark" effect="solid" />
      </IconWrapper>
      {open ? <RegisterNodeDialog handleClose={() => setOpen(false)} /> : null}
    </>
  )
}
