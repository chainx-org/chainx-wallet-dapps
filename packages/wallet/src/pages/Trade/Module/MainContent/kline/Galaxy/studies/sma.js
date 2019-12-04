import { SMA as samCalculator } from 'technicalindicators'

const maColorMap = {
  '5': '#BA4397',
  '10': '#B8946A',
  '20': '#2D7DA9'
}

export default class SMA {
  constructor(galaxy, candles, n) {
    this.galaxy = galaxy
    this.n = n
    this.values = samCalculator.calculate({
      period: this.n,
      values: candles.map(candle => candle.close)
    })
  }

  getToDrawValues() {
    const n = this.n

    let startIndex = this.galaxy.startIndex - n
    if (startIndex < 0) {
      startIndex = 0
    }
    const endIndex = this.galaxy.endIndex - n
    return this.values.slice(startIndex, endIndex + 1)
  }

  getMaxMinValue() {
    const values = this.getToDrawValues()
    const max = Math.max(...values)
    const min = Math.min(...values)
    return { max, min }
  }

  getCrosshairValue(crosshairIndex) {
    const values = this.getToDrawValues()
    let index = crosshairIndex
    if (this.galaxy.chosenItems.length > values.length) {
      const offsetIndex = this.galaxy.chosenItems.length - values.length
      index = crosshairIndex - offsetIndex
    }
    return index < 0 ? null : values[index]
  }

  draw() {
    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.galaxy.config.marginTop)

    const minPrice = this.galaxy.candles.minPrice
    const extent = this.galaxy.candles.extent

    const oneCandleSpace =
      this.galaxy.config.candle.width + this.galaxy.config.candle.interval
    const height = this.galaxy._getCandleCanvasHeight()

    const values = this.getToDrawValues()
    let offsetX =
      (this.galaxy.chosenItems.length - values.length) * oneCandleSpace
    const normalizedValue = values.map((value, index) => ({
      y: (1 - (value - minPrice) / extent) * height,
      x: oneCandleSpace * index + offsetX
    }))

    ctx.strokeStyle = maColorMap[this.n + '']

    ctx.beginPath()
    normalizedValue.forEach((sma, index) => {
      if (index === 0) {
        ctx.moveTo(sma.x, sma.y)
      } else {
        ctx.lineTo(sma.x, sma.y)
      }
    })
    ctx.stroke()

    ctx.restore()
  }
}
