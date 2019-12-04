import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKline } from '../../../../../reducers/klineSlice'
import Chart from './Chart'
import { candlesSelector } from './selectors'

export default function() {
  const dispatch = useDispatch()
  const data = useSelector(candlesSelector)

  useEffect(() => {
    dispatch(fetchKline())
  }, [dispatch])

  return (
    <Wrapper>
      {data.length > 0 ? <Chart type="hybrid" data={data} ratio={1} /> : null}
    </Wrapper>
  )
}
