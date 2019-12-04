import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import { useDispatch } from 'react-redux'
import { fetchKline } from '../../../../../reducers/klineSlice'
// import { candlesSelector } from './selectors'

export default function() {
  const dispatch = useDispatch()
  // const data = useSelector(candlesSelector)

  useEffect(() => {
    dispatch(fetchKline())
  }, [dispatch])

  return (
    <Wrapper>
      kline
      {/*{data.length > 0 ? <Chart type="hybrid" data={data} ratio={1} /> : null}*/}
    </Wrapper>
  )
}
