import Study from './study'
import { WilliamsR } from 'technicalindicators'
import Line from '../line'

const defaultConfig = { period: 14 }

export default class WR extends Study {
  constructor(galaxy, config = defaultConfig) {
    super(galaxy)

    this.config = Object.assign({}, defaultConfig, config)
    this.name = `Williams %R(${this.config.period})`

    const high = galaxy.items.map(item => item.high)
    const low = galaxy.items.map(item => item.low)
    const close = galaxy.items.map(item => item.close)
    const period = this.config.period
    this.values = WilliamsR.calculate({
      high,
      low,
      close,
      period
    })
    this.toDrawValues = this._getToDrawValues()
    this.offset = galaxy.chosenItems.length - this.toDrawValues.length

    this.maxValue = 0
    this.minValue = -100
    this.extent = 100
  }

  draw() {
    if (this.toDrawValues.length < 0) {
      this._drawBadge()
      return
    }

    const normalizedValues = this.toDrawValues.map((value, index) => ({
      x: (this.offset + index) * this.oneValueSpace,
      y: ((this.maxValue - value) / this.extent) * this.contentHeight
    }))

    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.y + this.headerHeight)
    this._drawYaxixMarks(ctx)
    ctx.strokeStyle = '#A4A4A4'

    ctx.beginPath()
    normalizedValues.forEach((value, index) => {
      if (index === 0) {
        ctx.moveTo(value.x, value.y)
      } else {
        ctx.lineTo(value.x, value.y)
      }
    })
    ctx.stroke()

    ctx.restore()
    this._drawBadge()
  }

  _drawYaxixMarks(ctx) {
    const fontHeight = parseInt(ctx.font)
    const marks = [-20, -50, -80].map(value => {
      const text = String(value)
      const y = ((this.maxValue - value) / this.extent) * this.contentHeight
      return { text, y }
    })

    ctx.save()
    ctx.setLineDash([5, 3])
    ctx.lineWidth = 0.05
    ctx.strokeStyle = '#DDD'
    const contentWidth = this.galaxy.canvas.width - this.galaxy.yAxisWidth
    marks.forEach(mark => {
      ctx.beginPath()
      ctx.moveTo(0, mark.y)
      ctx.lineTo(contentWidth, mark.y)
      ctx.closePath()
      ctx.stroke()
    })

    ctx.fillStyle = this.galaxy.config.axis.style
    ctx.translate(this.galaxy.canvas.width - this.galaxy.yAxisWidth, 0)
    marks.forEach(mark => {
      new Line(
        ctx,
        0,
        mark.y,
        3,
        mark.y,
        this.galaxy.config.axis.style,
        0.3
      ).draw()
      ctx.fillText(mark.text, 0, mark.y + fontHeight / 2 - 2)
    })
    ctx.restore()
  }
}
