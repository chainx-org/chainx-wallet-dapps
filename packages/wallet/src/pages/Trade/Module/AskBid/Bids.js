import React from 'react'
import { useSelector } from 'react-redux'

import { normalizedBidsSelector } from './selectors'
import Orders from './Orders'

export default function() {
  const bids = useSelector(normalizedBidsSelector)

  return <Orders orders={bids} />
}
