import React from 'react'
import Card from '../../../components/Card'
import Logo from '../Logo'
import lbtcLogo from './lbtc.svg'
import { useSelector } from 'react-redux'
import { lbtcSelector } from '../selectors'

export default function() {
  const lbtc = useSelector(lbtcSelector)

  return (
    <Card height={300}>
      <header>
        <Logo logo={lbtcLogo} name={lbtc.name} tokenName={lbtc.tokenName} />
      </header>
    </Card>
  )
}
