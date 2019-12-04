import _ from 'lodash'
import Candles from './candles/index'
import VolumeCanvas from './volume/volume-canvas'
import defaultConfig from './config'
import Line from './line'
import Xaxis from './x-axis'
import objectAssignDeep from 'object-assign-deep'
import MACD from './studies/macd'
import OBV from './studies/obv'
import KD from './studies/kd'
import RSI from './studies/rsi'
import CCI from './studies/cci'
import WR from './studies/wr'
import ROC from './studies/roc'
import StochRsi from './studies/stochrsi'

class Galaxy {
  constructor(context, items, step, config = defaultConfig) {
    if (!context) {
      throw new Error('canvas ctx invalid')
    }
    this.ctx = context
    this.canvas = this.ctx.canvas
    this.items = items
    this.step = step
    this.observers = []

    this.yAxisWidth = this._calcYAxisWidth()
    this.xAxisHeight = this._calcXAxisHeight()

    this.config = objectAssignDeep({}, defaultConfig, config)
    this.oneCandleSpace = this.config.candle.width + this.config.candle.interval

    this._resetChosenItems()

    if (this._getCandleCanvasHeight() <= 0) {
      throw new Error(
        'there is no enough space left for candle canvas, please check your configuration.'
      )
    }

    this.startDragX = null
    this.crossIndex = null
    this.offsetX = this.ctx.canvas.getBoundingClientRect().left
    this.offsetY = this.ctx.canvas.getBoundingClientRect().top

    this.mouseDown = this._mouseDown.bind(this)
    this.mouseUp = this._mouseUp.bind(this)
    this.mouseMove = _.throttle(this._mouseMove.bind(this), 10)
    this.canvas.onmousedown = this.mouseDown
    this.canvas.onmouseup = this.mouseUp
    this.canvas.onmousemove = this.mouseMove
    this.canvas.onmouseleave = () => {
      this.crossIndex = null
      this.draw()
      this.notify()
    }

    this.mousewheelListener = _.throttle(event => {
      event.preventDefault()

      if (Math.abs(event.deltaY) < 3 && Math.abs(event.deltaX) < 3) {
        return
      }

      if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
        event.deltaY > 0 ? this.zoomIn() : this.zoomOut()
      } else {
        const step = Math.ceil(Math.abs(event.deltaX) / this.oneCandleSpace)
        this._moveRight(event.deltaX > 0 ? -1 * step : step)
      }
    }, 20)
    this.canvas.addEventListener('mousewheel', this.mousewheelListener, true)
    this.touchstart = event =>
      this.canvas.dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: event.touches[0].clientX,
          clientY: event.touches[0].clientY
        })
      )
    this.canvas.addEventListener('touchstart', this.touchstart, false)
    this.touchend = () => this.canvas.dispatchEvent(new MouseEvent('mouseup'))
    this.canvas.addEventListener('touchend', this.touchend, false)
    this.touchmove = event =>
      this.canvas.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: event.touches[0].clientX,
          clientY: event.touches[0].clientY
        })
      )
    this.canvas.addEventListener('touchmove', this.touchmove, false)
  }

  destroy() {
    this.canvas.removeEventListener('mousewheel', this.mousewheelListener, true)
    this.canvas.removeEventListener('touchstart', this.touchstart, false)
    this.canvas.removeEventListener('touchend', this.touchend, false)
    this.canvas.removeEventListener('touchmove', this.touchmove, false)
  }

  removeStudy() {
    if (!this.config.study.separate) {
      return
    }

    this.config.study.separate = null
    this.config.marginBottom -= this.config.studyCanvasHeight
    this.config.studyCanvasHeight = 0
    this.draw()
  }

  addStudy(indicator) {
    if (!this.config.study.separate) {
      this.config.studyCanvasHeight = this.config.volumeCanvasHeight
      this.config.marginBottom += this.config.studyCanvasHeight
    }
    this.config.study.separate = indicator
    this.draw()
  }

  zoomIn() {
    this._zoom(true)
  }

  zoomOut() {
    this._zoom(false)
  }

  _getMaxCandleCount() {
    return (
      Math.floor((this.canvas.width - this.yAxisWidth) / this.oneCandleSpace) -
      1
    )
  }

  _zoom(isIn) {
    const zoomInButTooBig = isIn && this.config.candle.width > 50
    const zoomOutButTooSmall = !isIn && this.config.candle.width < 2
    if (zoomInButTooBig || zoomOutButTooSmall) {
      return
    }

    this.config.candle.width *= isIn ? 1.1 : 0.9
    this.config.candle.interval = this.config.candle.width * 0.4
    this.oneCandleSpace = this.config.candle.width + this.config.candle.interval
    this.maxCandleCount = this._getMaxCandleCount()

    this.startIndex = this.endIndex - this.maxCandleCount
    let promise = Promise.resolve()
    if (this.startIndex <= 0 && this.loader && !this.loading) {
      this.loading = true
      promise = this.loader.loadMore().then(() => (this.loading = false))
    }

    promise.then(() => {
      this.startIndex = this.startIndex < 0 ? 0 : this.startIndex
      this.endIndex = this.startIndex + this.maxCandleCount
      this.endIndex =
        this.endIndex > this.items.length ? this.items.length : this.endIndex

      this.chosenItems = this.items
        .slice(this.startIndex, this.endIndex + 1)
        .map((item, index) => {
          const x = index * this.oneCandleSpace
          return Object.assign({}, item, { x })
        })

      this.draw()
    })
  }

  prependItems(toPrependItems) {
    if (_.isEmpty(toPrependItems)) {
      return
    }

    if (
      this.items.length > 0 &&
      _.last(toPrependItems).date >= this.items[0].date
    ) {
      throw new Error(
        'Date of prepend items should be smaller than kline items'
      )
    }

    this.items = toPrependItems.concat(this.items)
    if (this.startIndex + toPrependItems.length >= 0) {
      this.startIndex += toPrependItems.length
    } else {
      this.startIndex = 0
    }
    this.endIndex += toPrependItems.length
  }

  attach(observer) {
    observer.setSubject(this)
    this.observers.push(observer)
  }

  attachLoader(loader) {
    this.loader = loader
    this.loader.setGalaxy(this)
  }

  notify() {
    this.observers.forEach(observer => observer.update())
  }

  resize() {
    const preMaxCandleCount = this.maxCandleCount
    this.maxCandleCount = this._getMaxCandleCount()
    // 当总共items的数量足够多，但只显示一部分的时候，保留原来的chosenItems
    if (preMaxCandleCount > this.chosenItems.length) {
      this.draw()
      return
    }

    const offset = Math.abs(this.maxCandleCount - this.chosenItems.length)
    if (this.maxCandleCount < this.chosenItems.length) {
      this.startIndex += this.chosenItems.length - this.maxCandleCount
    } else if (this.startIndex > 0) {
      this.startIndex -= offset
      this.startIndex = this.startIndex < 0 ? 0 : this.startIndex
    } else if (this.endIndex < this.items.length - 1) {
      this.endIndex += offset
      this.endIndex =
        this.endIndex > this.items.lenght - 1
          ? this.items.lenght - 1
          : this.endIndex
    }

    this.chosenItems = this.items
      .slice(this.startIndex, this.endIndex + 1)
      .map((item, index) =>
        Object.assign({}, item, { x: index * this.oneCandleSpace })
      )
    this.draw()
  }

  _resetChosenItems() {
    this.maxCandleCount = this._getMaxCandleCount()
    if (this.maxCandleCount < this.items.length) {
      this.endIndex = this.items.length - 1
      this.startIndex = this.endIndex - this.maxCandleCount
      this.startIndex = this.startIndex < 0 ? 0 : this.startIndex
    } else {
      this.startIndex = 0
      this.endIndex = this.items.length - 1
    }

    this.chosenItems = this.items
      .slice(this.startIndex, this.endIndex + 1)
      .map((item, index) =>
        Object.assign({}, item, { x: index * this.oneCandleSpace })
      )
  }

  draw() {
    this._drawBackground()
    this._drawXaxis()
    this._drawCandle()
    this._drawVolume()
    this._drawSeparateStudy()
  }

  _drawSeparateStudy() {
    this.separateStudy = null
    switch (this.config.study.separate) {
      case 'macd':
        this.separateStudy = new MACD(this, this.config.study.config.macd)
        break
      case 'obv':
        this.separateStudy = new OBV(this)
        break
      case 'kd':
        this.separateStudy = new KD(this, this.config.study.config.kd)
        break
      case 'rsi':
        this.separateStudy = new RSI(this, this.config.study.config.rsi)
        break
      case 'cci':
        this.separateStudy = new CCI(this, this.config.study.config.cci)
        break
      case 'wr':
        this.separateStudy = new WR(this, this.config.study.config.wr)
        break
      case 'roc':
        this.separateStudy = new ROC(this, this.config.study.config.roc)
        break
      case 'stochrsi':
        this.separateStudy = new StochRsi(
          this,
          this.config.study.config.stochrsi
        )
        break
      default:
        break
    }

    if (this.separateStudy) {
      this.separateStudy.draw()
    }
  }

  _calcYAxisWidth() {
    const maxPrice = Math.max(...this.items.map(item => item.high))
    const maxVolume = Math.max(...this.items.map(item => item.volume)).toFixed(
      2
    )
    const limbLength = 5
    const margin = 8
    return (
      Math.max(
        ...[maxPrice, maxVolume].map(
          item => this.ctx.measureText(String(item)).width
        )
      ) +
      limbLength +
      margin
    )
  }

  _calcXAxisHeight() {
    // TODO: remove magic number 5
    const limbLength = 8
    return parseInt(this.ctx.font) + limbLength + 5
  }

  _drawBackground() {
    this.ctx.save()
    this.ctx.fillStyle = this.config.backgroundColor
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.restore()
  }

  _getCandleCanvasHeight() {
    // TODO: 需要保证该值大于0
    return (
      this.canvas.height -
      this.config.marginTop -
      this.config.marginBottom -
      this.xAxisHeight
    )
  }

  _drawCandle() {
    this.candles = new Candles(this, {
      candleWidth: this.config.candle.width,
      candleInterval: this.config.candle.interval,
      upColor: this.config.candle.color.up,
      downColor: this.config.candle.color.down,
      axisWidth: this.yAxisWidth
    })
    this.candles.draw()
  }

  _drawVolume() {
    this.volumes = new VolumeCanvas(this, {
      candleWidth: this.config.candle.width,
      candleInterval: this.config.candle.interval,
      upColor: this.config.candle.color.up,
      downColor: this.config.candle.color.down,
      axisWidth: this.yAxisWidth,
      offsetX: 0,
      offsetY:
        this.canvas.height -
        this.config.volumeCanvasHeight -
        this.config.studyCanvasHeight -
        this.xAxisHeight,
      axis: {
        space: this.yAxisWidth,
        style: this.config.axis.style,
        width: this.config.axis.width
      }
    })
    this.volumes.draw()
  }

  _drawXaxis() {
    const width = this.canvas.width - this.yAxisWidth
    const height = this.canvas.height - this.xAxisHeight
    new Line(
      this.ctx,
      width,
      0,
      width,
      height,
      this.config.axis.style,
      this.config.axis.width
    ).draw()

    this.xaxis = new Xaxis(this, {
      width: this.config.axis.width,
      candleWidth: this.config.candle.width,
      candleInterval: this.config.candle.interval
    })
    this.xaxis.draw()
  }

  _mouseDown(event) {
    this.startDragX = event.clientX - this.offsetX
  }

  _mouseUp() {
    this.startDragX = null
  }

  _drawCrosshair(x, y) {
    this.draw()
    const width = this.canvas.width - this.yAxisWidth
    const height = this.canvas.height - this.xAxisHeight

    if (x >= width || y >= height) {
      this.crossIndex = null
      return
    }

    this.crossIndex = _.findLastIndex(this.chosenItems, item => item.x <= x)
    if (this.crossIndex < 0) {
      return
    }
    const showX =
      this.chosenItems[this.crossIndex].x + this.config.candle.width / 2

    new Line(
      this.ctx,
      showX,
      0,
      showX,
      height,
      this.config.crosshair.color,
      this.config.crosshair.width
    ).draw()
    new Line(
      this.ctx,
      0,
      y,
      width,
      y,
      this.config.crosshair.color,
      this.config.crosshair.width
    ).draw()

    this.xaxis.drawCrosshairMark(x)
    this.candles.drawCrosshairMark(y)
    this.volumes.drawCrosshairMark(y)

    if (this.separateStudy) {
      this.separateStudy.drawCrosshairMark(y)
    }
  }

  _mouseMove(event) {
    const nowMouseX = event.clientX - this.offsetX
    const nowMouseY = event.clientY - this.offsetY

    if (!nowMouseX || !nowMouseY) {
      return
    }

    if (this.startDragX === null) {
      this._drawCrosshair(nowMouseX, nowMouseY)
      this.notify()
      return
    }

    this.crossIndex = null
    if (nowMouseX <= 0 || nowMouseX > this.canvas.width - this.yAxisWidth) {
      return
    }

    const candleCount = Math.round(
      (this.startDragX - nowMouseX) / this.oneCandleSpace
    )
    if (Math.abs(candleCount) > 0) {
      this._moveRight(0 - candleCount)
      this.startDragX = nowMouseX
    }
  }

  _moveRight(candleCount) {
    const drawWidthStartIndex = () => {
      if (this.startIndex < 0) {
        this.startIndex = 0
      }

      this.endIndex = this.startIndex + this.maxCandleCount
      if (this.endIndex > this.items.length - 1) {
        this.endIndex = this.items.length - 1
      }

      this.chosenItems = this.items
        .slice(this.startIndex, this.endIndex + 1)
        .map((item, index) =>
          Object.assign({}, item, { x: index * this.oneCandleSpace })
        )

      this.draw()
      this.notify()
    }

    this.startIndex -= candleCount

    const startIndexTooSmall = this.startIndex < 0
    const notLoading = this.loader && !this.loading
    if (startIndexTooSmall && notLoading && !this.allLoaded) {
      this.loading = true
      return this.loader.loadMore().then(() => {
        this.loading = false
        drawWidthStartIndex()
      })
    }

    if (this.startIndex < 0 && this.loading) {
      return
    }

    if (this.startIndex < 0) {
      this.startIndex = 0
    }
    if (this.startIndex > this.items.length - 10) {
      this.startIndex = this.items.length - 10
    }

    drawWidthStartIndex()
  }
}

export default Galaxy
