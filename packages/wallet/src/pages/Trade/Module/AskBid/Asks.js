import React from 'react'
import { useSelector } from 'react-redux'
import Orders from './Orders'
import { normalizedAsksSelector } from '@pages/Trade/Module/AskBid/dexSelectors'

export default function() {
  const asks = useSelector(normalizedAsksSelector)

  return <Orders orders={asks} isAsk={true} />
}
