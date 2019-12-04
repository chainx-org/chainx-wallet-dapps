import Line from '../line'
import _ from 'lodash'

const defaultConfig = {
  style: '#959595',
  width: 0.05
}

export default class VolumeYaxis {
  constructor(galaxy, context, width, height, candles, config = defaultConfig) {
    this.galaxy = galaxy
    this.ctx = context
    this.width = width
    this.height = height
    this.candles = candles
    this.config = Object.assign({}, defaultConfig, config)

    this._initMarks()
  }

  _initMarks() {
    this.maxVolume = Math.max(...this.candles.map(candle => candle.volume))
    this.unitValue = this.maxVolume / this.height

    const integerPart = String(this.maxVolume).match(/^\d+(?=(\.\d+)?)/)[0]
    const decimalPart = (String(this.maxVolume).match(/^0\.(\d+)$/) || [])[1]
    const decimalPrecise = _.findIndex(decimalPart, item => item !== '0') + 2
    const yStep = Math.pow(
      10,
      Number(integerPart) > 0 ? integerPart.length - 2 : -1 * decimalPrecise
    )
    this.precise = Number(integerPart) > 0 ? 0 : decimalPrecise

    const marks = []
    let yVolume = 0
    let yHeight = this.height
    while (yHeight > 0) {
      marks.push({ volume: yVolume, y: yHeight })
      yVolume += yStep
      yHeight -= yStep / this.unitValue
    }

    const markCount = this.height / (parseInt(this.ctx.font) * 3)
    const chunks = _.chunk(marks, parseInt(marks.length / markCount))
    this.marks = chunks.map(chunk => chunk[0])
  }

  draw() {
    this.ctx.save()
    this.ctx.fillStyle = this.config.style

    this.marks.forEach(mark => {
      new Line(
        this.ctx,
        0,
        mark.y,
        this.width,
        mark.y,
        this.config.style,
        this.config.width
      ).draw()
      new Line(
        this.ctx,
        this.width,
        mark.y,
        this.width + 3,
        mark.y,
        this.config.style,
        0.3
      ).draw()
      this.ctx.fillText(
        mark.volume.toFixed(this.precise),
        this.width + 8,
        mark.y + parseInt(this.ctx.font) / 2 - 2
      )
    })

    this.ctx.restore()
  }

  drawCrosshairMark(y) {
    if (y < 0 || y > this.height) {
      return
    }

    this.ctx.save()

    const text = (this.maxVolume - y * this.unitValue).toFixed(this.precise)
    this.ctx.fillStyle = '#DDD'
    const fontHeight = parseInt(this.ctx.font)
    this.ctx.fillRect(
      this.width,
      y - fontHeight * 0.8,
      this.galaxy.yAxisWidth - 5,
      fontHeight * 1.6
    )

    this.ctx.fillStyle = '#343434'
    this.ctx.fillText(text, this.width + 8, y + fontHeight / 2)

    this.ctx.restore()
  }
}
