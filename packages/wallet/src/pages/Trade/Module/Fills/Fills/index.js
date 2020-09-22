import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFills, fillsSelector } from '../../../../../reducers/tradeSlice'
import { currentPairSelector } from '../../../../../reducers/dexSlice'
import { Empty } from '../../../../../components'
import TitledCard from '../../../components/TitledCard'
import Head from './Head'
import Body from './Body'

export default function() {
  const pair = useSelector(currentPairSelector)
  const fills = useSelector(fillsSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (pair) {
        dispatch(fetchFills(pair.id))
      }
    }, 5000)

    return () => clearInterval(intervalId)
  }, [dispatch, pair])

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
