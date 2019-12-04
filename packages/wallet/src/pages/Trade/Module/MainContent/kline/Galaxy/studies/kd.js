import Study from './study'
import { Stochastic } from 'technicalindicators'
import _ from 'lodash'

const defaultConfig = {
  period: 14,
  signalPeriod: 3
}

export default class KD extends Study {
  constructor(galaxy, config = defaultConfig) {
    super(galaxy)
    const high = galaxy.items.map(item => item.high)
    const low = galaxy.items.map(item => item.low)
    const close = galaxy.items.map(item => item.close)

    this.config = Object.assign({}, defaultConfig, config)
    this.values = Stochastic.calculate({
      high,
      low,
      close,
      period: this.config.period,
      signalPeriod: this.config.signalPeriod
    })
    this.toDrawValues = this._getToDrawValues()

    const kValues = this.toDrawValues
      .map(value => value.k)
      .filter(value => typeof value !== 'undefined')
    const dValues = this.toDrawValues
      .map(value => value.d)
      .filter(value => typeof value !== 'undefined')
    this.maxValue = Math.max(...kValues.concat(dValues))
    this.minValue = Math.min(...kValues.concat(dValues))
    this.extent = this.maxValue - this.minValue

    this.offset = galaxy.chosenItems.length - this.toDrawValues.length
    this.name = `KD(${this.config.period}, ${this.config.signalPeriod})`
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
    this._drawYaxixMarks(ctx)
    ctx.lineWidth = 1.2

    const kValues = this.toDrawValues.map(value => value.k)
    this._drawLine(kValues, '#A4A4A4')

    const dValues = this.toDrawValues.map(value => value.d)
    this._drawLine(dValues, '#D4CB41')

    ctx.restore()

    this._drawBadge()
  }

  _drawLine(values, color) {
    const ctx = this.galaxy.ctx
    const offset =
      this.offset + _.findIndex(values, value => typeof value !== 'undefined')
    const normalizedValues = values
      .filter(value => typeof value !== 'undefined')
      .map((value, index) => ({
        x: (index + offset) * this.oneValueSpace,
        y: ((this.maxValue - value) / this.extent) * this.contentHeight
      }))

    ctx.strokeStyle = color
    ctx.beginPath()
    normalizedValues.forEach((value, index) => {
      if (index === 0) {
        ctx.moveTo(value.x, value.y)
      } else {
        ctx.lineTo(value.x, value.y)
      }
    })
    ctx.stroke()
  }
}
