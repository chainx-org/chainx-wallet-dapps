import React from 'react'
import updateIcon from './update.svg'
import { IconWrapper } from '../components'

export default function() {
  return (
    <>
      <IconWrapper onClick={() => console.log('hello world')}>
        <img src={updateIcon} alt="register" />
      </IconWrapper>
    </>
  )
}
