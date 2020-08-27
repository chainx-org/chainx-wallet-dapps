import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import { useDispatch } from 'react-redux'
import { fetchTradePairs } from '../../reducers/tradeSlice'

export default function() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTradePairs())
  }, [dispatch])

  return (
    <Wrapper>
      {/*<Trade />*/}
      {/*<Orders />*/}
    </Wrapper>
  )
}
