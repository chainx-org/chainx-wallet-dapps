import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  currentPairSelector,
  fetchFills
} from '../../../../../reducers/tradeSlice'
import { Empty } from '../../../../../components'
import TitledCard from '../../../components/TitledCard'
import { normalizedCurrentFillsSelector } from '../../selectors'
import Head from './Head'
import Body from './Body'

export default function() {
  const pair = useSelector(currentPairSelector)
  const fills = useSelector(normalizedCurrentFillsSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (pair) {
      dispatch(fetchFills(pair.id))
    }
  }, [dispatch, pair])

  return (
    <TitledCard style={{ marginTop: 16 }}>
      <header>Latest</header>
      <Head />
      <Body />
      {fills.length <= 0 && <Empty text={'无成交'} style={{ marginTop: 30 }} />}
    </TitledCard>
  )
}
