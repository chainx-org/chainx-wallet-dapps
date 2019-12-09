import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import Trade from './Module'
import { useDispatch } from 'react-redux'
import { fetchTradePairs } from '../../reducers/tradeSlice'
import Orders from './Orders'

export default function() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTradePairs())
  }, [dispatch])

  return (
    <Wrapper>
      <Trade />
      <Orders />
    </Wrapper>
  )
}
