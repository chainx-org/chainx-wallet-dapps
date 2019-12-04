import _ from 'lodash'
import Candle from './candle'
import Yaxis from './y-axis'
import BOLL from '../studies/boll'
import SAR from '../studies/sar'
import CandleSma from './ma'

const defaultConfig = {
  upColor: '#FF4A4A',
  downColor: '#78e397',
  candleWidth: 5, // 单根蜡烛的宽度
  candleInterval: 2, //两根蜡烛之间的间隔宽度
  axisWidth: 20
}

export default class Candles {
  constructor(galaxy, config = defaultConfig) {
    this.galaxy = galaxy
    this.ctx = galaxy.ctx
    this.height = galaxy._getCandleCanvasHeight()
    this.config = Object.assign({}, defaultConfig, config)
    this.oneCandleSpace = this.config.candleWidth + this.config.candleInterval

    if (galaxy.config.study.candle === 'boll') {
      this.study = new BOLL(galaxy)
    } else if (galaxy.config.study.candle === 'sar') {
      this.study = new SAR(galaxy)
    } else if (galaxy.config.study.candle === 'ma') {
      this.study = new CandleSma(galaxy)
    }

    this._setItems(galaxy.chosenItems)
  }

  _setItems(items) {
    this.maxPrice = Math.max(...items.map(item => item.high))
    this.minPrice = Math.min(...items.map(item => item.low))
    if (this.study && this.galaxy.config.study.candle === 'boll') {
      this.maxPrice = Math.max(
        ...this.study.toDrawValues
          .map(value => value.upper)
          .concat(this.maxPrice)
      )
      this.minPrice = Math.min(
        ...this.study.toDrawValues
          .map(value => value.lower)
          .concat(this.minPrice)
      )
    }
    if (this.study && this.galaxy.config.study.candle === 'sar') {
      this.maxPrice = Math.max(...this.study.toDrawValues.concat(this.maxPrice))
      this.minPrice = Math.min(...this.study.toDrawValues.concat(this.minPrice))
    }
    if (this.study && this.galaxy.config.study.candle === 'ma') {
      this.maxPrice = Math.max(this.maxPrice, this.study.max)
      this.minPrice = Math.min(this.minPrice, this.study.min)
    }

    this.extent = this.maxPrice - this.minPrice

    this.items = items
  }

  draw() {
    this.ctx.save()
    this.ctx.translate(0, this.galaxy.config.marginTop)
    this._drawYaxis()

    const candleConfig = _(this.config)
      .pick(['upColor', 'downColor'])
      .merge({ width: this.config.candleWidth })
      .value()

    this.items.forEach(item => {
      this.ctx.save()
      this.ctx.translate(item.x, 0)
      new Candle(
        this.ctx,
        item,
        this.height,
        this.extent,
        this.maxPrice,
        candleConfig
      ).draw()
      this.ctx.restore()
    })

    // this._drawMaxAndMinPrice()

    this.ctx.restore()

    if (this.study) {
      this.study.draw()
    }
  }

  _drawMaxAndMinPrice() {
    const maxPrice = Math.max(...this.galaxy.chosenItems.map(item => item.high))
    const minPrice = Math.min(...this.galaxy.chosenItems.map(item => item.low))

    const itemWithMaxHigh = this.galaxy.chosenItems.find(
      item => item.high === maxPrice
    )
    const itemWithMinLow = this.galaxy.chosenItems.find(
      item => item.low === minPrice
    )

    this.ctx.save()
    this.ctx.fillStyle = '#DDD'

    const maxPriceText = String(itemWithMaxHigh.high)
    const maxPriceTextWidth = this.ctx.measureText(maxPriceText).width
    const expectMaxX = itemWithMaxHigh.x - maxPriceTextWidth
    const maxAllowedMaxX = _.last(this.galaxy.chosenItems).x - maxPriceTextWidth
    const maxPriceX =
      expectMaxX > 0
        ? expectMaxX > maxAllowedMaxX
          ? maxAllowedMaxX
          : expectMaxX
        : 0
    const maxPriceY = ((this.maxPrice - maxPrice) / this.extent) * this.height
    this.ctx.fillText(maxPriceText, maxPriceX, maxPriceY)

    const minPriceText = String(itemWithMinLow.low)
    const minPriceTextWidth = this.ctx.measureText(minPriceText).width
    const expectMinX = itemWithMinLow.x - minPriceTextWidth
    const maxAllowedMinX = _.last(this.galaxy.chosenItems).x - minPriceTextWidth
    const minPriceX =
      expectMinX > 0
        ? expectMinX > maxAllowedMinX
          ? maxAllowedMinX
          : expectMinX
        : 0
    const minPriceY = ((this.maxPrice - minPrice) / this.extent) * this.height
    this.ctx.fillText(
      minPriceText,
      minPriceX,
      minPriceY + parseInt(this.ctx.font)
    )
    this.ctx.restore()
  }

  _drawYaxis() {
    this.yAxis = new Yaxis(this.galaxy)
    this.yAxis.draw()
  }

  drawCrosshairMark(y) {
    this.ctx.save()
    this.ctx.translate(0, this.galaxy.config.marginTop)
    this.yAxis.drawCrosshairMark(y - this.galaxy.config.marginTop)
    this.ctx.restore()
  }
}
