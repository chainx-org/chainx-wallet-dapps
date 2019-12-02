import React, { useEffect } from 'react'
import TitledCard from '../../components/TitledCard'
import {
  currentPairSelector,
  fetchQuotations
} from '../../../../reducers/tradeSlice'
import { useDispatch, useSelector } from 'react-redux'
import Asks from './Asks'
import Price from './Price'
import Bids from './Bids'

export default function() {
  const pair = useSelector(currentPairSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (pair) {
      dispatch(fetchQuotations(pair.id))
    }
  }, [dispatch, pair])

  return (
    <TitledCard>
      <header>Open Orders</header>
      <Asks />
      <Price />
      <Bids />
    </TitledCard>
  )
}
