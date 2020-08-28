import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import { useDispatch } from 'react-redux'
import { fetchDexPairs } from '@reducers/dexSlice'

export default function() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDexPairs())
  }, [dispatch])

  return (
    <Wrapper>
      {/*<Trade />*/}
      {/*<Orders />*/}
    </Wrapper>
  )
}
