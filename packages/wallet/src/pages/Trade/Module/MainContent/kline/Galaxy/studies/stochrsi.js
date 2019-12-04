import Study from './study'
import { RSI as rsiCalculator } from 'technicalindicators'
import { SMA } from 'technicalindicators'
import Line from '../line'

const defaultConfig = {
  period: 14,
  smaPeriod: 5
}

export default class StochRsi extends Study {
  constructor(galaxy, config = defaultConfig) {
    super(galaxy)
    this.ctx = galaxy.ctx

    this.config = Object.assign({}, defaultConfig, config)

    const period = this.config.period
    const closes = galaxy.items.map(item => item.close)
    const rsiValues = rsiCalculator.calculate({ values: closes, period })

    this.stochRsiValues = this._calcStochRsi(rsiValues, period)
    const smaPeriod = this.config.smaPeriod
    this.smaValues = SMA.calculate({
      values: this.stochRsiValues,
      period: smaPeriod
    })

    this.maValueKey = 'MA' + smaPeriod
    this.values = this.stochRsiValues.reduce((result, value, index) => {
      if (index < this.stochRsiValues.length - this.smaValues.length) {
        result.push({
          STOCHRSI: value
        })
      } else {
        result.push({
          STOCHRSI: value,
          [this.maValueKey]: this.smaValues[
            index - this.stochRsiValues.length + this.smaValues.length
          ]
        })
      }

      return result
    }, [])

    this.toDrawValues = this._getToDrawValues()
    this.offset = galaxy.items.length - this.values.length

    this.maxValue = 1
    this.minValue = 0
    this.extent = 1

    this.name = `StochRSI(${period})`
    this.precise = 2
  }

  _calcStochRsi(rsiValues, period) {
    if (rsiValues.length < period) {
      return []
    }

    return rsiValues.reduce((result, value, index) => {
      if (index >= period - 1) {
        const targetItems = rsiValues.slice(index - period + 1, index + 1)
        const max = Math.max(...targetItems)
        const min = Math.min(...targetItems)
        result.push(max === min ? 0 : (value - min) / (max - min))
      }

      return result
    }, [])
  }

  draw() {
    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.y + this.headerHeight)

    this._drawStochRsi()
    this._drawMa()
    this._drawYaxixMarks()

    ctx.restore()

    this._drawBadge()
  }

  _drawStochRsi() {
    const ctx = this.galaxy.ctx
    ctx.save()
    const offset = this.galaxy.chosenItems.length - this.toDrawValues.length
    const normalizedValues = this.toDrawValues.map((value, index) => ({
      x: (offset + index) * this.oneValueSpace,
      y: ((this.maxValue - value.STOCHRSI) / this.extent) * this.contentHeight
    }))

    ctx.strokeStyle = '#A4A4A4'

    ctx.beginPath()
    normalizedValues.forEach((value, index) => {
      ;(index === 0 ? ctx.moveTo : ctx.lineTo).bind(ctx)(value.x, value.y)
    })
    ctx.stroke()
    ctx.restore()
  }

  _drawMa() {
    this.ctx.save()
    this.ctx.strokeStyle = '#CCC23B'

    const maValues = this.toDrawValues
      .map(value => value[this.maValueKey])
      .filter(value => typeof value !== 'undefined')

    const offset = this.galaxy.chosenItems.length - maValues.length
    const normalizedValues = maValues.map((value, index) => ({
      x: (offset + index) * this.oneValueSpace,
      y: ((this.maxValue - value) / this.extent) * this.contentHeight
    }))

    this.ctx.beginPath()
    normalizedValues.forEach((value, index) => {
      ;(index === 0 ? this.ctx.moveTo : this.ctx.lineTo).bind(this.ctx)(
        value.x,
        value.y
      )
    })
    this.ctx.stroke()

    this.ctx.restore()
  }

  _drawYaxixMarks() {
    const marks = [0.2, 0.5, 0.8].map(value => ({
      text: String(value),
      y: ((this.maxValue - value) / this.extent) * this.contentHeight
    }))

    this.ctx.save()
    this.ctx.fillStyle = this.galaxy.config.axis.style
    this.ctx.translate(this.galaxy.canvas.width - this.galaxy.yAxisWidth, 0)
    const fontHeight = parseInt(this.ctx.font)
    marks.forEach(mark => {
      new Line(
        this.ctx,
        0,
        mark.y,
        3,
        mark.y,
        this.galaxy.config.axis.style,
        0.3
      ).draw()
      this.ctx.fillText(mark.text, 8, mark.y + fontHeight / 2 - 2)
    })

    this.ctx.restore()
  }
}
