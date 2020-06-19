import { getLocale } from '../../locale'
import {
  betHeightSelector,
  betStatusEnum,
  nowBtcSelector
} from '../../reducers/oddevenSlice'
import { useSelector } from 'react-redux'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment)

const BettingWrapper = styled.section`
  display: inline-flex;
  align-items: flex-end;
  padding-right: 16px;
`

const Time = styled.span`
  opacity: 0.72;
  font-weight: 600;
  font-size: 28px;
  color: #000000;
  letter-spacing: 0.21px;
  text-align: right;
  line-height: 28px;
`

const Hint = styled.span`
  opacity: 0.56;
  font-weight: 600;
  font-size: 12px;
  color: #000000;
  letter-spacing: 0.09px;
  text-align: right;
  line-height: 20px;
  margin-left: 4px;
`

function BettingStatus() {
  const betHeight = useSelector(betHeightSelector)
  const btc = useSelector(nowBtcSelector)
  const [blockMinutes, setBlockMinutes] = useState(
    (betHeight - btc.height - 20) * 10
  )
  const [duration, setDuration] = useState(
    moment.duration(blockMinutes, 'minutes').format('hh:mm:ss')
  )
  const [timerSeconds, setTimerSeconds] = useState(0)

  useEffect(() => {
    setTimerSeconds(0)
  }, [btc.height])

  useEffect(() => {
    setTimeout(() => {
      setTimerSeconds(timerSeconds + 1)
    }, 1000)
  }, [timerSeconds])

  useEffect(() => {
    setBlockMinutes((betHeight - btc.height - 20) * 10)
  }, [betHeight, btc.height])

  useEffect(() => {
    setDuration(
      moment
        .duration(blockMinutes * 60 - timerSeconds, 'seconds')
        .format('hh:mm:ss')
    )
  }, [timerSeconds, blockMinutes])

  return (
    <BettingWrapper>
      <Time>{duration}</Time>
      <Hint>后停止 (预计)</Hint>
    </BettingWrapper>
  )
}

const RedWrapper = styled.section`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ff3b30;
  letter-spacing: 0.09px;
  text-align: right;
  line-height: 20px;
  padding-right: 16px;
`

export default function({ children }) {
  const isZh = getLocale() !== 'en'
  switch (children) {
    case betStatusEnum.ON:
      return <BettingStatus />
    case betStatusEnum.FILL:
      return <RedWrapper>{isZh ? '已结束' : 'Finished'}</RedWrapper>
    case betStatusEnum.TO_FILL:
      return (
        <RedWrapper>{isZh ? '已停止 等待开奖' : 'Waiting reward'}</RedWrapper>
      )
    case betStatusEnum.CLOSE:
    default:
      return '敬请期待'
  }
}
