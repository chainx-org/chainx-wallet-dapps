import React from 'react'
import CardWrapper from '../components/CardWrapper'
import { normalizedSdotSelector } from '../selectors'
import { useSelector } from 'react-redux'
import Header from '../Header'
import { token } from '../../../utils/constants'

export default function() {
  const sdot = useSelector(normalizedSdotSelector)
  const header = <Header token={token.SDOT} />
  return <CardWrapper header={header} intention={sdot} />
}
