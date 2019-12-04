import React, { useEffect, useState } from 'react'
import Wrapper from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKline } from '../../../../../reducers/klineSlice'
import { candlesSelector } from './selectors'
import Galaxy from './Galaxy/main'

const canvasId = 'chainx-kline'

export default function() {
  const dispatch = useDispatch()
  const data = useSelector(candlesSelector)
  const [canvasRendered, setCanvasRendered] = useState(false)

  useEffect(() => {
    dispatch(fetchKline())
  }, [dispatch])

  useEffect(() => {
    if (canvasRendered || !data.length) {
      return
    }

    const canvas = window.document.getElementById(canvasId)
    const context = canvas.getContext('2d')

    const items = data.map(d => ({
      ...d,
      date: d.date.getTime()
    }))

    const galaxy = new Galaxy(context, items, 604800)
    galaxy.draw()

    setCanvasRendered(true)
    return () => galaxy.destroy()
  }, [data, canvasRendered])

  return (
    <Wrapper>
      <canvas id={canvasId} width="600" height="250"></canvas>
    </Wrapper>
  )
}
