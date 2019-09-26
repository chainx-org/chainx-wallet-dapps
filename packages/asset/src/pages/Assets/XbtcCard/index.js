import React from 'react'
import Card from '../../../components/Card'
import Logo from '../Logo'
import xbtcLogo from './xbtc.svg'
import { useSelector } from 'react-redux'
import { xbtcSelector } from '../selectors'

export default function() {
  const xbtc = useSelector(xbtcSelector)

  return (
    <Card height={300}>
      <header>
        <Logo logo={xbtcLogo} name="X-BTC" tokenName={xbtc.tokenName} />
      </header>
    </Card>
  )
}
