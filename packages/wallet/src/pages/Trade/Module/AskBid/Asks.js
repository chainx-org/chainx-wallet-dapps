import React from 'react'
import { useSelector } from 'react-redux'
import { normalizedAsksSelector } from './selectors'
import Orders from './Orders'

export default function() {
  const asks = useSelector(normalizedAsksSelector)

  return <Orders orders={asks} isAsk={true} />
}
