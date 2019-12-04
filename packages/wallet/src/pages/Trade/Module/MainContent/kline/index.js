import React, { useEffect, useState } from 'react'
import Wrapper from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchKline,
  klineTypeSelector
} from '../../../../../reducers/klineSlice'
import { typeCandlesSelector } from './selectors'
import Galaxy from './Galaxy/main'
import TypeSelector from './TypeSelector'

const canvasId = 'chainx-kline'

export default function() {
  const dispatch = useDispatch()
  const data = useSelector(typeCandlesSelector)
  const [lastType, setLastType] = useState(null)
  const klineType = useSelector(klineTypeSelector)

  useEffect(() => {
    dispatch(fetchKline(klineType))
  }, [dispatch, klineType])

  useEffect(() => {
    if (!data.length) {
      return
    }

    if (klineType === lastType) {
      return
    }

    const canvas = window.document.getElementById(canvasId)
    const context = canvas.getContext('2d')

    const galaxy = new Galaxy(context, data, klineType)
    galaxy.draw()

    setLastType(klineType)
    return () => galaxy.destroy()
  }, [data, klineType, lastType])

  return (
    <Wrapper>
      <TypeSelector />
      <canvas id={canvasId} width="600" height="260" />
    </Wrapper>
  )
}
