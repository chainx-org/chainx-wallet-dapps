import moment from 'moment'
import Line from './line'
import _ from 'lodash'

const defaultConfig = {
  style: '#7F8A99',
  width: 0.05,
  candleWidth: 5,
  candleInterval: 2
}

export default class Xaxis {
  constructor(galaxy, config = defaultConfig) {
    this.galaxy = galaxy
    this.ctx = galaxy.ctx
    this.width = galaxy.canvas.width - galaxy.yAxisWidth
    this.height = galaxy.canvas.height - galaxy.xAxisHeight
    this.candles = galaxy.chosenItems
    this.step = galaxy.step
    this.config = Object.assign({}, defaultConfig, config)
    this.oneCandleSpace = this.config.candleWidth + this.config.candleInterval

    this._initMarks()
  }

  _getMarksForStep60() {
    const marks = []

    const eachMinuteLength =
      this.config.candleWidth + this.config.candleInterval
    const firstMinute = this.candles[0].date / 60000
    const step = this.oneCandleSpace < 2.5 ? 60 : 30
    let iterDate = firstMinute + step - (firstMinute % step)

    while (
      (iterDate - firstMinute) * eachMinuteLength +
        this.config.candleWidth / 2 <
      this.width
    ) {
      const hourMinText = moment(iterDate * 60 * 1000).format('HH:mm')
      const text =
        hourMinText === '00:00'
          ? moment(iterDate * 60 * 1000).format('MM/DD')
          : hourMinText
      marks.push({
        text,
        x:
          (iterDate - firstMinute) * eachMinuteLength +
          this.config.candleWidth / 2
      })
      iterDate += step
    }
    return marks
  }

  _getMarksForStep1Day() {
    const marks = []

    const eachDayLength = this.config.candleWidth + this.config.candleInterval
    let iterDate = this.candles[0].date
    let x = this.config.candleWidth / 2
    while (x < this.width) {
      const dateMoment = moment(iterDate)
      if (dateMoment.date() === 1) {
        marks.push({
          text: dateMoment.format(dateMoment.month() === 0 ? 'YYYY' : 'MMM'),
          x
        })
      }

      iterDate += this.step * 1000
      x =
        ((iterDate - this.candles[0].date) / 1000 / this.step) * eachDayLength +
        this.candles[0].x +
        this.config.candleWidth / 2
    }
    return marks
  }

  _getMarksForStep1Month() {
    const marks = []
    const eachMonthLength = this.config.candleWidth + this.config.candleWidth

    let iterMoment = moment(this.candles[0].date)
    let x = this.config.candleWidth / 2
    while (x < this.width) {
      if (iterMoment.month() === 0) {
        marks.push({ text: iterMoment.format('YYYY'), x })
      }

      iterMoment = iterMoment.add(1, 'months')
      x += eachMonthLength
    }

    return marks
  }

  _getMarksForStep1Week() {
    const marks = []

    const oneDaySeconds = 86400
    const eachDayLength =
      (this.config.candleWidth + this.config.candleInterval) / 7
    let iterDate = this.candles[0].date
    let iterX = this.config.candleWidth / 2
    while (iterX < this.width) {
      const dateMoment = moment(iterDate)
      if (dateMoment.date() === 1 && dateMoment.month() % 6 === 0) {
        const text = dateMoment.format(
          dateMoment.month() === 0 ? 'YYYY' : 'MMM'
        )
        marks.push({ text, x: iterX })
      }

      iterDate += oneDaySeconds * 1000
      iterX =
        ((iterDate - this.candles[0].date) / 1000 / oneDaySeconds) *
          eachDayLength +
        this.candles[0].x +
        this.config.candleWidth / 2
    }
    return marks
  }

  _initMarks() {
    if (this.step === 60) {
      return (this.marks = this._getMarksForStep60())
    }

    if (this.step === 86400) {
      return (this.marks = this._getMarksForStep1Day())
    }

    if (this.step === 604800) {
      return (this.marks = this._getMarksForStep1Week())
    }

    if (this.step === 2592000) {
      return (this.marks = this._getMarksForStep1Month())
    }

    const marks = []
    this.candles.forEach((candle, index) => {
      const x = candle.x + this.config.candleWidth / 2
      const candleMoment = moment(candle.date)

      if (candleMoment.format('HH:mm') === '00:00') {
        marks.push({ text: candleMoment.format('MM/DD'), x, date: candle.date })
        return
      }

      const dateFormat = 'HH:mm'
      const hasEngouhSpace =
        this.ctx.measureText(dateFormat).width < this.oneCandleSpace * 10
      const hour = candleMoment.hour()
      switch (this.step) {
        case 300:
          if (hasEngouhSpace && hour % 2 === 0 && candleMoment.minute() === 0) {
            marks.push({
              text: candleMoment.format(dateFormat),
              x,
              date: candle.date
            })
          }
          break
        case 900:
          if (hasEngouhSpace && hour % 3 === 0 && candleMoment.minute() === 0) {
            marks.push({
              text: candleMoment.format(dateFormat),
              x,
              date: candle.date
            })
          }
          break
        case 1800:
          if (hasEngouhSpace && hour % 6 === 0 && candleMoment.minute() === 0) {
            marks.push({
              text: candleMoment.format(dateFormat),
              x,
              date: candle.date
            })
          }
          break
        case 3600:
          if (
            hasEngouhSpace &&
            hour % 12 === 0 &&
            candleMoment.minute() === 0
          ) {
            marks.push({
              text: candleMoment.format(dateFormat),
              x,
              date: candle.date
            })
          }
          break
        default:
          throw new Error(`unknown step ${this.step}`)
      }
    })

    this.marks = marks
  }

  _drawBottomLine() {
    new Line(
      this.ctx,
      0,
      this.height,
      this.width,
      this.height,
      this.config.style,
      this.config.width
    ).draw()
  }

  draw() {
    this._drawBottomLine()
    this.ctx.save()
    this.ctx.fillStyle = this.config.style

    this.marks.forEach(mark => {
      const x = mark.x - this.ctx.measureText(mark.text).width / 2
      if (x < 0 || x > this.width - 20) {
        return
      }
      new Line(
        this.ctx,
        mark.x,
        0,
        mark.x,
        this.height,
        this.config.style,
        this.config.width
      ).draw()
      new Line(
        this.ctx,
        mark.x,
        this.height,
        mark.x,
        this.height + 3,
        this.config.style,
        0.3
      ).draw()
      this.ctx.fillText(mark.text, x, this.height + parseInt(this.ctx.font) + 8)
    })

    this.ctx.restore()
  }

  drawCrosshairMark(x) {
    const crossIndex = _.findLastIndex(
      this.galaxy.chosenItems,
      item => item.x <= x
    )
    const showX =
      this.galaxy.chosenItems[crossIndex].x +
      this.galaxy.config.candle.width / 2

    this.ctx.save()

    const fontHeight = parseInt(this.ctx.font)
    const xTextFormat =
      this.step === 86400 // 1 day
        ? 'YYYY/MM/DD'
        : this.step === 2592000 // 1 month
        ? 'YYYY/MM'
        : 'MM/DD HH:mm'
    const xText = moment(this.galaxy.chosenItems[crossIndex].date).format(
      xTextFormat
    )
    const textWidth = this.ctx.measureText(xText).width

    const xAxisMarkLocation =
      showX - textWidth / 2 - 5 > 0 ? showX - textWidth / 2 - 5 : 0
    this.ctx.fillStyle = this.galaxy.config.crosshair.markBackgroundColor
    this.ctx.fillRect(
      xAxisMarkLocation,
      this.height,
      textWidth + 10,
      this.galaxy.xAxisHeight
    )

    this.ctx.fillStyle = this.galaxy.config.crosshair.markTextColor
    this.ctx.fillText(
      xText,
      xAxisMarkLocation + 5,
      this.height + fontHeight + 8
    )

    this.ctx.restore()
  }
}
