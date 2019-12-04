import { PSAR } from 'technicalindicators'

export default class SAR {
  constructor(galaxy) {
    this.galaxy = galaxy

    const [high, low] = galaxy.items.reduce(
      (result, item) => {
        result[0].push(item.high)
        result[1].push(item.low)
        return result
      },
      [[], []]
    )

    const step = 0.02
    const max = 0.2

    this.values = PSAR.calculate({ high, low, step, max })
    this.toDrawValues = this._getToDrawValues()
    this.offset = galaxy.chosenItems.length - this.toDrawValues.length
    this.oneCandleSpace =
      this.galaxy.config.candle.width + this.galaxy.config.candle.interval
  }

  _getToDrawValues() {
    const offset = this.galaxy.items.length - this.values.length
    let startIndex = this.galaxy.startIndex - offset
    let endIndex = this.galaxy.endIndex - offset

    if (endIndex < 0) {
      return []
    }

    startIndex = startIndex < 0 ? 0 : startIndex
    return this.values.slice(startIndex, endIndex + 1)
  }

  draw() {
    if (this.toDrawValues.length <= 0) {
      return
    }

    this.maxValue = this.galaxy.candles.maxPrice
    this.minValue = this.galaxy.candles.minPrice
    this.extent = this.maxValue - this.minValue
    this.height = this.galaxy._getCandleCanvasHeight()

    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.galaxy.config.marginTop)

    const normalizedValues = this.toDrawValues.map((value, index) => ({
      x: (index + this.offset) * this.oneCandleSpace,
      y: ((this.maxValue - value) / this.extent) * this.height
    }))

    ctx.strokeStyle = '#DDD'
    normalizedValues.forEach(value => {
      ctx.beginPath()
      ctx.moveTo(value.x, value.y)
      ctx.lineTo(value.x + this.galaxy.config.candle.width, value.y)
      ctx.stroke()
    })

    ctx.restore()
  }

  getCrosshairValue() {
    if (this.galaxy.crossIndex === null) {
      return null
    }
    const index = this.galaxy.crossIndex - this.offset
    return index < 0 ? null : this.toDrawValues[index]
  }
}
