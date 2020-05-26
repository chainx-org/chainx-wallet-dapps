import React, { useEffect, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import {
  fetchChainStatus,
  fetchPower,
  powerSelector,
  statusSelector
} from '../../reducers/powerSlice'
import NumberFormat from '../../components/NumberFormat'

import { LinearProgress, Paper } from '@chainx/ui'
import styled from 'styled-components'
import $t from '../../locale'

const PowerPaper = styled(Paper)`
  width: 300px;
  margin-left: 16px;
  padding: 16px;
`

const TitleWrapper = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.72);
  margin-bottom: 20px;
`
const TotalWrapper = styled.div`
  margin-bottom: 32px;
`

const TotalItem = styled.div`
  margin-bottom: 12px;
`

const TotalHeader = styled.div`
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const TotalTitle = styled.div`
  color: rgba(0, 0, 0, 0.32);
`

const ListWrapper = styled.div`
  margin-top: 24px;
`

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.32);
  font-size: 12px;
`

const Circle = styled.span`
  display: inline-block;
  border-radius: 50%;
  height: 12px;
  width: 12px;
  vertical-align: -2px;
  margin-right: 12px;
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

    ctx.fillStyle = 'black'
    ctx.font = '16px serif'
    ctx.textAlign = 'center'
    ctx.fillText($t('CHAIN_POWER_PERCENTAGE'), centerX, centerY + 4)
  }
}

const total = 2100 * Math.pow(10, 4) * Math.pow(10, 8)

export default function Power() {
  const canvasRef = useRef(null)
  const dispatch = useDispatch()
  const power = useSelector(powerSelector)
  const status = useSelector(statusSelector)
  const colors = [
    '#F6C94A',
    '#C2C2C2',
    '#46AEE2',
    '#34C69A',
    '#D64CAB',
    '#F7931B'
  ]

  const powersWithColor = power.map((p, index) => {
    return {
      color: colors[index],
      ...p
    }
  })

  useEffect(() => {
    dispatch(fetchPower())
    dispatch(fetchChainStatus())
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
      <TitleWrapper>{$t('CHAIN_STAT')}</TitleWrapper>
      <TotalWrapper>
        <TotalItem>
          <TotalHeader>
            <TotalTitle>{$t('CHAIN_ISSUANCE')}</TotalTitle>
            <div style={{ color: 'rgba(0,0,0,.32)' }}>
              <NumberFormat value={status.pcx_issuance / 100000000} />
              /<NumberFormat value={21000000} />
            </div>
          </TotalHeader>
          <div>
            <LinearProgress value={(status.pcx_issuance / total) * 100} />
          </div>
        </TotalItem>
        {/* <TotalItem>
          <TotalHeader>
            <TotalTitle>日挖矿量（PCX）</TotalTitle>
            <div>14,400/7,400</div>
          </TotalHeader>
          <div>
            <LinearProgress value={50} />
          </div>
        </TotalItem> */}
      </TotalWrapper>
      <div>
        <canvas ref={canvasRef} />
      </div>
      <ListWrapper>
        {powersWithColor.map(p => {
          return (
            <ListItem key={p.name}>
              <div>
                <Circle color={p.color} />
                {p.name}
              </div>
              <div>{(p.power * 100).toFixed(2)}%</div>
            </ListItem>
          )
        })}
      </ListWrapper>
    </PowerPaper>
  )
}
