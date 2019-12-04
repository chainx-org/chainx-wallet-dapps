const defaultConfig = {
  upColor: '#FF4A4A',
  downColor: '#78e397',
  width: 5
}

class Candle {
  constructor(context, ohlc, height, extent, maxPrice, config = defaultConfig) {
    this.ctx = context
    this.ohlc = this._checkOhlc(ohlc)
    this.config = config
    this.height = height
    this.extent = extent
    this.maxPrice = maxPrice
  }

  _checkOhlc(ohlc) {
    if (ohlc.high < Math.max(ohlc.open, ohlc.close)) {
      throw new Error('high should be bigger than open or close')
    }

    if (ohlc.low > Math.min(ohlc.open, ohlc.close)) {
      throw new Error('low should be smaller than open or close')
    }

    return ohlc
  }

  draw() {
    this.ctx.strokeStyle =
      this.ohlc.open > this.ohlc.close
        ? this.config.downColor
        : this.config.upColor
    this.ctx.fillStyle = this.ctx.strokeStyle

    this._drawUpperShadow()
    this._drawBody()
    this._drawLowerShadow()
  }

  _drawUpperShadow() {
    if (this.ohlc.high <= Math.max(this.ohlc.open, this.ohlc.close)) {
      return
    }

    const highY = this._calcY(this.ohlc.high)
    const openOrCloseY = this._calcY(Math.max(this.ohlc.open, this.ohlc.close))

    this.ctx.beginPath()
    this.ctx.moveTo(this.config.width / 2, highY)
    this.ctx.lineTo(this.config.width / 2, openOrCloseY)
    this.ctx.closePath()
    this.ctx.stroke()
  }

  _calcY(value) {
    return ((this.maxPrice - value) * this.height) / this.extent
  }

  _drawBody() {
    const x = 0
    const upY = this._calcY(Math.max(this.ohlc.open, this.ohlc.close))
    const downY = this._calcY(Math.min(this.ohlc.open, this.ohlc.close))
    const height = Math.abs(downY - upY)
    if (height > 1) {
      this.ctx.fillRect(x, upY, this.config.width, height)
    } else {
      this.ctx.beginPath()
      this.ctx.moveTo(x, upY)
      this.ctx.lineTo(this.config.width + x, upY)
      this.ctx.closePath()
      this.ctx.stroke()
    }
  }

  _drawLowerShadow() {
    if (this.ohlc.low >= Math.min(this.ohlc.open, this.ohlc.close)) {
      return
    }

    const x = this.config.width / 2
    const lowY = this._calcY(this.ohlc.low)
    const openOrCloseY = this._calcY(Math.min(this.ohlc.open, this.ohlc.close))
    this.ctx.beginPath()
    this.ctx.moveTo(x, openOrCloseY)
    this.ctx.lineTo(x, lowY)
    this.ctx.closePath()
    this.ctx.stroke()
  }
}

export default Candle
