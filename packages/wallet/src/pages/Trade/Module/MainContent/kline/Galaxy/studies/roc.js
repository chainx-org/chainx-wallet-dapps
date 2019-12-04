import _ from 'lodash'
import Study from './study'
import { ROC as rocCalculator, SMA as smaCalculator } from 'technicalindicators'
import Line from '../line'

const defaultConfig = {
  period: 12,
  maPeriod: 6
}

export default class ROC extends Study {
  constructor(galaxy, config = defaultConfig) {
    super(galaxy)

    this.config = Object.assign({}, defaultConfig, config)

    const values = galaxy.items.map(item => item.close)
    this.rocValues = rocCalculator.calculate({
      values,
      period: this.config.period
    })
    this.maRocValues = smaCalculator.calculate({
      values: this.rocValues,
      period: this.config.maPeriod
    })

    this.name = `ROC(${this.config.period}, ${this.config.maPeriod})`

    this.rocToDrawValues = this._getRocToDrawValues()
    this.rocOffset =
      this.galaxy.chosenItems.length - this.rocToDrawValues.length

    this.maRocToDrawValues = this._getMaRocToDrawValues()
    this.maRocoffset =
      this.galaxy.chosenItems.length - this.maRocToDrawValues.length

    const concatedValues = this.rocToDrawValues.concat(this.maRocToDrawValues)
    this.maxValue = Math.max(...concatedValues)
    this.minValue = Math.min(...concatedValues)
    this.extent = this.maxValue - this.minValue
  }

  draw() {
    if (this.rocToDrawValues.length < 0) {
      this._drawBadge()
      return
    }

    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.y + this.headerHeight)

    this._drawRoc()
    this._drawMaRoc()

    this._drawYaxixMarks()

    ctx.restore()
    this._drawBadge()
  }

  _drawRoc() {
    const rocToDrawValues = this._getRocToDrawValues()
    this._drawLine(rocToDrawValues, '#A4A4A4')
  }

  _drawLine(values, color) {
    const ctx = this.galaxy.ctx
    const offset = this.galaxy.chosenItems.length - values.length

    const normalizedValues = values.map((value, index) => ({
      x: (index + offset) * this.oneValueSpace,
      y: ((this.maxValue - value) / this.extent) * this.contentHeight
    }))

    ctx.strokeStyle = color
    ctx.beginPath()
    normalizedValues.forEach((value, index) => {
      ;(index === 0 ? ctx.moveTo : ctx.lineTo).bind(ctx)(value.x, value.y)
    })
    ctx.stroke()
  }

  _getRocToDrawValues() {
    const offset = this.galaxy.items.length - this.rocValues.length
    let startIndex = this.galaxy.startIndex - offset
    let endIndex = this.galaxy.endIndex - offset

    if (endIndex < 0) {
      return []
    }

    startIndex = startIndex < 0 ? 0 : startIndex
    return this.rocValues.slice(startIndex, endIndex + 1)
  }

  _drawMaRoc() {
    const maRocToDrawValues = this._getMaRocToDrawValues()
    this._drawLine(maRocToDrawValues, '#CCC23B')
  }

  _getMaRocToDrawValues() {
    const offset = this.galaxy.items.length - this.maRocValues.length
    let startIndex = this.galaxy.startIndex - offset
    let endIndex = this.galaxy.endIndex - offset

    if (endIndex < 0) {
      return []
    }

    startIndex = startIndex < 0 ? 0 : startIndex
    return this.maRocValues.slice(startIndex, endIndex + 1)
  }

  _drawYaxixMarks() {
    const marks = []
    let value = parseInt(this.minValue)
    let yHeight = ((this.maxValue - value) / this.extent) * this.contentHeight

    while (yHeight > 0) {
      marks.push({ value, y: yHeight })
      value += 1
      yHeight -= (1 / this.extent) * this.contentHeight
    }

    const ctx = this.galaxy.ctx
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
        mark.value.toFixed(0),
        8,
        mark.y + parseInt(ctx.font) / 2 - 2
      )
    })
    ctx.restore()
  }

  drawCrosshairMark(y) {
    const noValues = this.rocValues.length <= 0 && this.maRocValues.length <= 0
    const yInvalid =
      y < this.y || y > this.galaxy.canvas.height - this.galaxy.xAxisHeight
    if (yInvalid || noValues) {
      return
    }

    const value =
      this.maxValue -
      ((y - this.y) / this.galaxy.config.studyCanvasHeight) * this.extent
    const text = value.toFixed(1)
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

  getCrosshairValue() {
    if (this.galaxy.crossIndex === null) {
      return null
    }

    const rocIndex = this.galaxy.crossIndex - this.rocOffset
    const roc = rocIndex < 0 ? null : this.rocToDrawValues[rocIndex]

    const maRocIndex = this.galaxy.crossIndex - this.maRocoffset
    const maRoc = maRocIndex < 0 ? null : this.maRocToDrawValues[maRocIndex]
    return { roc, maRoc }
  }
}
