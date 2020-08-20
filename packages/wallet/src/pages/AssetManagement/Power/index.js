import React, { useEffect, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { fetchPower, powerSelector } from '../../../reducers/powerSlice'

import { Paper } from '@chainx/ui'
import styled from 'styled-components'
import $t from '../../../locale'
import chunk from 'lodash.chunk'

const PowerPaper = styled(Paper)`
  width: 300px;
  margin-left: 16px;
  padding: 16px;
`

const Header = styled.header`
  opacity: 0.72;
  font-weight: 600;
  font-size: 16px;
  color: #000000;
  letter-spacing: 0.14px;
  line-height: 24px;
  padding: 0 16px 12px;
  border-bottom: 1px solid #eeeeee;
  margin: 0 -16px;
`

const Content = styled.div`
  padding-top: 16px;
`

const ListWrapper = styled.div`
  margin-top: 16px;

  & > div:last-of-type {
    margin-top: 8px;
  }
`

const Line = styled.div`
  line-height: 1;
  display: flex;
  justify-content: space-between;
`
const ListItem = styled.div`
  width: 108px;
  display: inline-flex;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.32);
  font-size: 12px;

  span {
    opacity: 0.56;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.2px;
    line-height: 16px;
  }

  & > div:last-of-type {
    opacity: 0.72;
    font-weight: 600;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.1px;
    text-align: right;
    line-height: 16px;
  }
`

const Circle = styled.span`
  display: inline-block;
  border-radius: 50%;
  height: 8px;
  width: 8px;
  margin-right: 4px;
  background: ${props => props.color};
`

class Piechart {
  constructor(options) {
    this.options = options
    this.canvas = options.canvas
    this.ctx = this.canvas.getContext('2d')
    this.colors = options.colors
  }

  drawPieSlice = (
    ctx,
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
    color
  ) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fill()
  }

  draw = (data = []) => {
    if (data.length <= 0) {
      return
    }

    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2
    const ctx = this.ctx
    const radius = Math.min(centerX, centerY)

    const totalValue = data.reduce((result, item) => result + item, 0)
    let colorIndex = 0
    let startAngle = Math.PI

    for (let categ in data) {
      const val = data[categ]
      const sliceAngle = (2 * Math.PI * val) / totalValue

      this.drawPieSlice(
        ctx,
        centerX,
        centerY,
        radius,
        startAngle,
        startAngle + sliceAngle,
        this.colors[colorIndex % this.colors.length]
      )

      startAngle += sliceAngle
      colorIndex++
    }

    this.drawPieSlice(
      ctx,
      centerX,
      centerY,
      radius - this.options.width,
      0,
      2 * Math.PI,
      '#ffffff'
    )
  }
}

export default function Power() {
  const canvasRef = useRef(null)
  const dispatch = useDispatch()
  const power = useSelector(powerSelector)
  const colors = [
    '#F6C94A',
    '#C2C2C2',
    '#46AEE2',
    // '#34C69A',
    // '#D64CAB',
    '#F7931B'
  ]

  const powersWithColor = power.map((p, index) => {
    return {
      color: colors[index],
      ...p
    }
  })
  const chunks = chunk(powersWithColor, 2)

  useEffect(() => {
    dispatch(fetchPower())
  }, [dispatch])

  useEffect(() => {
    if (power) {
      const canvas = canvasRef.current
      canvas.height = 188
      const chart = new Piechart({
        canvas: canvas,
        colors,
        width: 40
      })

      const percents = power.map(p => p.power)
      chart.draw(percents)
    }
  }, [power, colors])

  return (
    <PowerPaper>
      <Header>{$t('CHAIN_POWER_PERCENTAGE')}</Header>
      <Content>
        <canvas ref={canvasRef} />
      </Content>
      <ListWrapper>
        {chunks.map((chunk, idx) => {
          return (
            <Line key={idx}>
              {chunk.map(item => {
                return (
                  <ListItem key={item.name}>
                    <div>
                      <Circle color={item.color} />
                      <span>{item.name}</span>
                    </div>
                    <div>{(item.power * 100).toFixed(2)}%</div>
                  </ListItem>
                )
              })}
            </Line>
          )
        })}
      </ListWrapper>
    </PowerPaper>
  )
}
