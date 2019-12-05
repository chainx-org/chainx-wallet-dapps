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
import Head from './Head'

export default function() {
  const pair = useSelector(currentPairSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (pair) {
      dispatch(fetchQuotations(pair.id))
    }
  }, [dispatch, pair])

  return (
    <TitledCard style={{ height: 590, paddingBottom: 0 }}>
      <header>Open Orders</header>
      <Head />
      <Asks />
      <Price />
      <Bids />
    </TitledCard>
  )
}
