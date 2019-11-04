import React from 'react'
import CardWrapper from '../components/CardWrapper'
import { useSelector } from 'react-redux'
import { normalizedXbtcSelector } from '../selectors'
import { token } from '../../../utils/constants'
import Header from '../Header'

export default function() {
  const xbtc = useSelector(normalizedXbtcSelector)
  const header = <Header token={token.XBTC} />

  return <CardWrapper header={header} intention={xbtc} />
}
