import React from 'react'
import Card from '../../../components/Card'
import Logo from '../Logo'
import sdotLogo from './sdot.svg'
import { useSelector } from 'react-redux'
import { sdotSelector } from '../selectors'

export default function() {
  const sdot = useSelector(sdotSelector)

  return (
    <Card height={300}>
      <header>
        <Logo logo={sdotLogo} name={sdot.name} tokenName={sdot.tokenName} />
      </header>
    </Card>
  )
}
