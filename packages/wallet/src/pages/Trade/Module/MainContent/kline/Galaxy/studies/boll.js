import { BollingerBands } from 'technicalindicators'

export default class BOLL {
  constructor(galaxy) {
    this.galaxy = galaxy

    const closes = galaxy.items.map(item => item.close)
    this.values = BollingerBands.calculate({
      period: 20,
      values: closes,
      stdDev: 2
    })

    this.toDrawValues = this._getToDrawValues()
    this.offset = galaxy.chosenItems.length - this.toDrawValues.length
    this.height = galaxy._getCandleCanvasHeight()
    this.oneCandleSpace =
      this.galaxy.config.candle.width + this.galaxy.config.candle.interval
  }

  _getToDrawValues() {
    const n = 20 - 1

    const endIndex = this.galaxy.endIndex - n
    if (endIndex <= 0) {
      return []
    }

    let startIndex = this.galaxy.startIndex - n
    if (startIndex < 0) {
      startIndex = 0
    }

    return this.values.slice(startIndex, endIndex + 1)
  }

  getCrosshairValue() {
    if (this.galaxy.crossIndex === null) {
      return null
    }
    const crosshairIndex = this.galaxy.crossIndex
    const index = crosshairIndex - this.offset
    return index < 0 ? null : this.toDrawValues[index]
  }

  draw() {
    if (this.values.length <= 0) {
      return
    }

    this.maxPrice = this.galaxy.candles.maxPrice
    this.minPrice = this.galaxy.candles.minPrice
    this.extent = this.maxPrice - this.minPrice

    const uppers = this.toDrawValues.map(item => item.upper)
    const lowers = this.toDrawValues.map(item => item.lower)
    const middles = this.toDrawValues.map(item => item.middle)

    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.galaxy.config.marginTop)
    ctx.lineWidth = 1.5

    this._drawLine(uppers, '#CCC23B')
    this._drawLine(middles, '#979797')
    this._drawLine(lowers, '#AB1AB0')

    ctx.restore()
  }

  _drawLine(values, color) {
    const normaliedValues = values.map((value, index) => ({
      x: this.oneCandleSpace * (index + this.offset),
      y: (1 - (value - this.minPrice) / this.extent) * this.height
    }))

    const ctx = this.galaxy.ctx
    ctx.strokeStyle = color
    ctx.beginPath()
    normaliedValues.forEach((value, index) => {
      if (index === 0) {
        ctx.moveTo(value.x, value.y)
      } else {
        ctx.lineTo(value.x, value.y)
      }
    })
    ctx.stroke()
  }
}
