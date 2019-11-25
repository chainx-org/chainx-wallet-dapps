import React, { useRef, useEffect } from 'react'

import { Paper, LinearProgress } from '@chainx/ui'
import styled from 'styled-components'

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

  draw = data => {
    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2
    const ctx = this.ctx
    const radius = Math.min(centerX, centerY)

    var totalValue = 0
    var colorIndex = 0

    for (var categ in data) {
      var val = data[categ]
      totalValue += val
    }

    var startAngle = Math.PI

    for (categ in data) {
      val = data[categ]
      var sliceAngle = (2 * Math.PI * val) / totalValue

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
    ctx.fillText('算力占比', centerX, centerY + 4)
  }
}

export default function Power() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.height = 188
    const chart = new Piechart({
      canvas: canvas,
      colors: ['#EA754B', '#34C69A', '#46AEE2', '#F6C94A'],
      width: 40
    })

    chart.draw({
      'S-DOT': 1,
      'X-BTC': 1.6,
      'L-BTC': 22.4,
      PCX: 75
    })
  })

  return (
    <PowerPaper>
      <TitleWrapper>链状态</TitleWrapper>
      <TotalWrapper>
        <TotalItem>
          <TotalHeader>
            <TotalTitle>发行总量（PCX）</TotalTitle>
            <div>21,000,000/1,757,400</div>
          </TotalHeader>
          <div>
            <LinearProgress value={50} />
          </div>
        </TotalItem>
        <TotalItem>
          <TotalHeader>
            <TotalTitle>日挖矿量（PCX）</TotalTitle>
            <div>14,400/7,400</div>
          </TotalHeader>
          <div>
            <LinearProgress value={50} />
          </div>
        </TotalItem>
      </TotalWrapper>
      <div>
        <canvas ref={canvasRef} />
      </div>
      <ListWrapper>
        <ListItem>
          <div>
            <Circle color="#F6C94A" />
            PCX
          </div>
          <div>75.0%</div>
        </ListItem>
        <ListItem>
          <div>
            <Circle color="#46AEE2" />
            L-BTC
          </div>
          <div>22.4%</div>
        </ListItem>
        <ListItem>
          <div>
            <Circle color="#34C69A" />
            X-BTC
          </div>
          <div>1.6%</div>
        </ListItem>
        <ListItem>
          <div>
            <Circle color="#EA754B" />
            S-DOT
          </div>
          <div>1.0%</div>
        </ListItem>
      </ListWrapper>
    </PowerPaper>
  )
}
