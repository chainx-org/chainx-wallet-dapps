import React from 'react'
import CardWrapper from '../components/CardWrapper'
import { normalizedLbtcSelector } from '../selectors'
import { useSelector } from 'react-redux'
import Header from '../Header'
import { token } from '../../../utils/constants'

export default function() {
  const lbtc = useSelector(normalizedLbtcSelector)
  const header = <Header token={token.LBTC} />

  return <CardWrapper header={header} intention={lbtc} />
}
