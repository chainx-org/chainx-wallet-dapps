import { MACD as macdCalculator } from 'technicalindicators'
import Study from './study'
import objectAssignDeep from 'object-assign-deep'

const defaultConfiguration = {
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9,
  SimpleMAOscillator: false,
  SimpleMASignal: false
}

export default class MACD extends Study {
  constructor(
    galaxy,
    config = { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
  ) {
    super(galaxy)

    this.name = 'MACD(12, 26, 9)'
    this.config = objectAssignDeep({}, defaultConfiguration, config)

    this.values = macdCalculator
      .calculate({
        values: galaxy.items.map(item => item.close),
        fastPeriod: this.config.fastPeriod,
        slowPeriod: this.config.slowPeriod,
        signalPeriod: this.config.signalPeriod
      })
      .filter(
        value =>
          value.MACD !== undefined &&
          value.signal !== undefined &&
          value.histogram !== undefined
      )
    this.toDrawValues = this._getToDrawValues()
    this.offset = galaxy.chosenItems.length - this.toDrawValues.length
  }

  draw() {
    if (this.values.length <= 0) {
      this._drawBadge()
      return
    }

    const galaxy = this.galaxy
    const ctx = galaxy.ctx
    ctx.save()
    ctx.translate(0, this.y + this.headerHeight)

    this.maxValue = Math.max(
      ...this.toDrawValues.map(value =>
        Math.max(value.MACD, value.signal, value.histogram)
      )
    )
    this.minValue = Math.min(
      ...this.toDrawValues.map(value =>
        Math.min(value.MACD, value.signal, value.histogram)
      )
    )
    this.extent = this.maxValue - this.minValue

    ctx.save()
    ctx.translate(this.offset * this.oneValueSpace, 0)
    this._drawHistograms()
    this._drawLine('macd')
    this._drawLine('signal')
    ctx.restore()

    this._drawYaxixMarks(ctx)
    ctx.restore()

    this._drawBadge()
  }

  _drawLine(type = 'macd') {
    const values = this.toDrawValues.map(value =>
      type === 'macd' ? value.MACD : value.signal
    )

    const ctx = this.galaxy.ctx
    ctx.beginPath()
    ctx.strokeStyle = type === 'macd' ? '#028AEB' : '#CA5931'

    values.forEach((macd, index) => {
      const x = index * this.oneValueSpace
      const y = ((this.maxValue - macd) / this.extent) * this.contentHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
  }

  _drawHistograms() {
    const candleConfig = this.galaxy.config.candle

    const historgams = this.toDrawValues.map(value => value.histogram)
    const value0Height = (this.maxValue / this.extent) * this.contentHeight

    const ctx = this.galaxy.ctx
    historgams.forEach((histogram, index) => {
      const height = (Math.abs(histogram) / this.extent) * this.contentHeight
      const isUp = histogram > 0

      ctx.fillStyle = isUp ? candleConfig.color.up : candleConfig.color.down
      const y = isUp ? value0Height - height : value0Height
      ctx.fillRect(index * this.oneValueSpace, y, candleConfig.width, height)
    })
  }
}
