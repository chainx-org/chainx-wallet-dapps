import React, { useEffect } from 'react'
import TitledCard from '../../components/TitledCard'
import {
  currentPairSelector,
  fetchQuotations
} from '../../../../reducers/tradeSlice'
import { useDispatch, useSelector } from 'react-redux'
import Asks from './Asks'
import { normalizedCurrentFillsSelector } from '../selectors'
import Price from './Price'

export default function() {
  const pair = useSelector(currentPairSelector)
  const dispatch = useDispatch()
  const [latest] = useSelector(normalizedCurrentFillsSelector)
  console.log('latest', latest)

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
    </TitledCard>
  )
}
