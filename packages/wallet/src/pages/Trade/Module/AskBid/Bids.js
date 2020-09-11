import React from 'react'
import { useSelector } from 'react-redux'

import Orders from './Orders'
import { normalizedBidsSelector } from '@pages/Trade/Module/AskBid/dexSelectors'

export default function() {
  const bids = useSelector(normalizedBidsSelector)

  return <Orders orders={bids} />
}
