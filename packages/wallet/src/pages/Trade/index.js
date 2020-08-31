import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import { useDispatch } from 'react-redux'
import { fetchDexDepth, fetchDexPairs } from '@reducers/dexSlice'
import Trade from './Module'

export default function() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDexPairs())
    dispatch(fetchDexDepth())
  }, [dispatch])

  return (
    <Wrapper>
      <Trade />
      {/*<Orders />*/}
    </Wrapper>
  )
}
