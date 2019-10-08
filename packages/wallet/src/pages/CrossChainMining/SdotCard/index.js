import React from 'react'
import Logo from '../components/Logo'
import icon from '../../../staic/sdot.svg'
import CardWrapper from '../components/CardWrapper'

export default function() {
  return (
    <CardWrapper>
      <header>
        <Logo icon={icon} name={'S-DOT'} />
      </header>
      <hr />
    </CardWrapper>
  )
}
