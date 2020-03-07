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
import { currentPairIdSelector } from '../../../../../reducers/tradeSlice'
import Stat from './Stat'
import { networkSelector } from '../../../../../reducers/settingsSlice'

const canvasId = 'chainx-kline'

export default function() {
  const dispatch = useDispatch()
  const data = useSelector(typeCandlesSelector)
  const [lastType, setLastType] = useState(null)
  const [lastPairId, setLastPairId] = useState(null)
  const klineType = useSelector(klineTypeSelector)
  const pairId = useSelector(currentPairIdSelector)
  const [candle, setCandle] = useState(null)
  const network = useSelector(networkSelector)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typeof pairId === 'number') {
        dispatch(fetchKline(pairId, klineType))
      }
    }, 20000)

    return () => clearInterval(intervalId)
  }, [dispatch, pairId, klineType, network])

  useEffect(() => {
    if (typeof pairId === 'number') {
      dispatch(fetchKline(pairId, klineType))
    }
  }, [dispatch, pairId, klineType, network])

  class Observer {
    setSubject(galaxy) {
      this.galaxy = galaxy
    }

    update() {
      setCandle(
        this.galaxy.crossIndex
          ? this.galaxy.items[this.galaxy.crossIndex]
          : null
      )
    }
  }

  const observer = new Observer()

  useEffect(() => {
    if (!data.length) {
      return
    }

    // if (klineType === lastType && pairId === lastPairId) {
    //   return
    // }

    const canvas = window.document.getElementById(canvasId)
    const context = canvas.getContext('2d')

    const galaxy = new Galaxy(context, data, klineType)
    galaxy.draw()
    galaxy.attach(observer)

    setLastType(klineType)
    setLastPairId(pairId)
    return () => galaxy.destroy()
  }, [data, klineType, lastType, pairId, lastPairId, observer, network])

  return (
    <Wrapper>
      <TypeSelector />
      {candle ? <Stat candle={candle} /> : null}
      <canvas id={canvasId} width="600" height="260" />
    </Wrapper>
  )
}
