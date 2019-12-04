import Line from '../line'
import _ from 'lodash'

const defaultConfig = {
  style: '#959595',
  width: 0.05,
  mark: {
    background: '#DDD',
    text: '#343434'
  }
}

export default class Yaxis {
  constructor(galaxy, config = defaultConfig) {
    this.galaxy = galaxy
    this.ctx = galaxy.ctx
    this.width = this.ctx.canvas.width - galaxy.candles.config.axisWidth
    this.height = galaxy._getCandleCanvasHeight()
    this.candles = galaxy.chosenItems
    this.config = Object.assign({}, defaultConfig, config)

    if (this.candles.length <= 0) {
      throw new Error('no candles specified for y-axis')
    }

    this._initMarks()
  }

  _initMarks() {
    this.maxPrice = this.galaxy.candles.maxPrice
    const minPrice = this.galaxy.candles.minPrice
    // TODO: 在这之前需要保证数据的正确性，保证candle不会出现low比high大的情况。
    // TODO: 考虑candles为空的情况
    let extent = this.maxPrice - minPrice
    if (extent === 0) {
      extent = this.maxPrice * 0.2
    }
    this.unitValue = extent / this.height

    this.integerPart = String(extent).match(/^\d+(?=(\.\d+)?)/)[0]
    this.decimalPart = (String(extent).match(/^0\.(\d+)$/) || [])[1]
    const decimalPrecise =
      _.findIndex(this.decimalPart, item => item !== '0') + 2
    const yStep = Math.pow(
      10,
      Number(this.integerPart) > 0
        ? this.integerPart.length - 2
        : -1 * decimalPrecise
    )

    const marks = []
    let yPrice = this.maxPrice - (this.maxPrice % yStep)
    let yHeight = (this.maxPrice % yStep) / this.unitValue
    while (yHeight < this.height) {
      if (yHeight < 0) {
        continue
      }

      marks.push({
        text: yPrice.toFixed(Number(this.integerPart) > 0 ? 0 : decimalPrecise),
        y: yHeight
      })

      yPrice -= yStep
      yHeight += yStep / this.unitValue
    }

    const markCount = this.height / (parseInt(this.ctx.font) * 8)
    const chunkCnt = parseInt(marks.length / markCount)
    const chunks = _.chunk(marks, chunkCnt <= 0 ? 1 : chunkCnt)
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
        mark.text,
        this.width + 8,
        mark.y + parseInt(this.ctx.font) / 2 - 2
      )
    })

    this.ctx.restore()
  }

  drawCrosshairMark(y) {
    if (y > this.height) {
      return
    }

    const decimalPrecise =
      _.findIndex(this.decimalPart, item => item !== '0') + 3

    const price = (this.maxPrice - y * this.unitValue).toFixed(
      Number(this.integerPart) > 0 ? 0 : decimalPrecise
    )
    this.ctx.fillStyle = this.config.mark.background
    const fontHeight = parseInt(this.ctx.font)

    this.ctx.fillRect(
      this.width,
      y - fontHeight * 0.8,
      this.galaxy.yAxisWidth - 5,
      fontHeight * 1.6
    )

    this.ctx.fillStyle = this.config.mark.text
    this.ctx.fillText(price, this.width + 8, y + fontHeight / 2)
  }
}
