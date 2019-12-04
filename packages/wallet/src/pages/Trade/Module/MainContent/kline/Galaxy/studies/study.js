import Line from '../line'
import _ from 'lodash'

export default class Study {
  constructor(galaxy) {
    this.galaxy = galaxy

    this.height = galaxy.config.studyCanvasHeight
    this.headerHeight = 20
    this.contentHeight = this.height - this.headerHeight
    this.y =
      galaxy.canvas.height -
      galaxy.config.studyCanvasHeight -
      galaxy.xAxisHeight
    const candleConfig = this.galaxy.config.candle
    this.oneValueSpace = candleConfig.width + candleConfig.interval
    this.contentWidth = galaxy.canvas.width - galaxy.yAxisWidth
  }

  _drawHeader() {
    const ctx = this.galaxy.ctx
    const endX = ctx.canvas.width - this.galaxy.yAxisWidth

    new Line(ctx, 0, this.y, endX, this.y, '#666', 0.3).draw()
    new Line(
      ctx,
      0,
      this.y + this.headerHeight,
      endX,
      this.y + this.headerHeight,
      '#666',
      0.3
    ).draw()
  }

  _drawBadge() {
    this._drawHeader()

    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.y)
    ctx.fillStyle = '#FFF'

    let text = this.name
    const crosshairValue = this.getCrosshairValue()
    if (
      crosshairValue !== null &&
      ['string', 'number'].includes(typeof crosshairValue)
    ) {
      text += ' ' + Number(crosshairValue).toFixed(2)
    } else if (crosshairValue !== null && typeof crosshairValue === 'object') {
      for (let [key, value] of Object.entries(crosshairValue)) {
        text += ` ${key}: ${Number(value).toFixed(2)}`
      }
    }
    ctx.fillText(text, 10, 3 + parseInt(ctx.font))
    ctx.restore()
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

  _drawYaxixMarks(ctx) {
    if (this.values.length <= 0) {
      return
    }

    const integerPart = String(this.maxValue).match(
      /^[+-]?(\d+)(?=(\.\d+)?)/
    )[1]
    const decimalPart = (String(this.maxValue).match(/^0\.(\d+)$/) || [])[1]
    const decimalPrecise = _.findIndex(decimalPart, item => item !== '0') + 2
    const yStep = Math.pow(
      10,
      Number(integerPart) > 0 ? integerPart.length - 2 : -1 * decimalPrecise
    )
    this.precise = Number(integerPart) > 0 ? 0 : decimalPrecise

    const marks = []
    let value = this.minValue
    let yHeight = this.contentHeight
    while (yHeight > 0) {
      marks.push({ value, y: yHeight })
      value += yStep
      yHeight -= (yStep / this.extent) * this.contentHeight
    }

    const markCount = this.contentHeight / (parseInt(ctx.font) * 3)
    const chunks = _.chunk(marks, parseInt(marks.length / markCount))
    const showMarks = chunks.map(chunk => chunk[0])

    ctx.save()
    ctx.fillStyle = this.galaxy.config.axis.style
    ctx.translate(this.galaxy.canvas.width - this.galaxy.yAxisWidth, 0)
    showMarks.forEach(mark => {
      new Line(
        ctx,
        0,
        mark.y,
        3,
        mark.y,
        this.galaxy.config.axis.style,
        0.3
      ).draw()
      ctx.fillText(
        mark.value.toFixed(this.precise),
        8,
        mark.y + parseInt(ctx.font) / 2
      )
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

  drawCrosshairMark(y) {
    const noValues = this.values.length <= 0
    const yInvalid =
      y < this.y + this.headerHeight ||
      y > this.galaxy.canvas.height - this.galaxy.xAxisHeight
    if (yInvalid || noValues) {
      return
    }

    const value =
      this.maxValue -
      ((y - this.y - this.headerHeight) / this.contentHeight) * this.extent
    const text = value.toFixed(this.precise)
    const ctx = this.galaxy.ctx

    ctx.save()
    ctx.fillStyle = '#DDD'
    const fontHeight = parseInt(ctx.font)
    const width = this.galaxy.canvas.width - this.galaxy.yAxisWidth
    ctx.translate(width, 0)
    ctx.fillRect(
      0,
      y - fontHeight * 0.8,
      this.galaxy.yAxisWidth - 5,
      fontHeight * 1.6
    )

    ctx.fillStyle = '#343434'
    ctx.fillText(text, 8, y + fontHeight / 2)
    ctx.restore()
  }
}
