import VolumeYaxis from './volume-y-axis'
import objectAssignDeep from 'object-assign-deep'
import Line from '../line'

const defaultConfig = {
  upColor: '#FF4A4A',
  downColor: '#78e397',
  candleWidth: 5, // 单根蜡烛的宽度
  candleInterval: 2, //两根蜡烛之间的间隔宽度
  axisWidth: 20,
  offsetX: 0,
  offsetY: 0,
  axis: {
    space: 20,
    style: '#DDD',
    width: 0.05
  }
}

export default class VolumeCanvas {
  constructor(galaxy, config = defaultConfig) {
    this.galaxy = galaxy
    this.ctx = galaxy.ctx
    this.height = galaxy.config.volumeCanvasHeight
    this.config = objectAssignDeep({}, defaultConfig, config)

    this.items = galaxy.chosenItems
    this.maxVolume = Math.max(...this.items.map(item => item.volume))
    this.oneCandleSpace = this.config.candleWidth + this.config.candleInterval
  }

  _drawYaxis() {
    const width = this.ctx.canvas.width - this.config.axis.space
    this.yaxis = new VolumeYaxis(
      this.galaxy,
      this.ctx,
      width,
      this.height,
      this.items,
      {
        style: this.config.axis.style,
        width: this.config.axis.width
      }
    )
    this.yaxis.draw()
  }

  _drawSeparatorLine() {
    const endX = this.ctx.canvas.width - this.config.axis.space
    new Line(this.ctx, 0, 0, endX, 0, '#666', 0.5).draw()
  }

  drawCrosshairMark(y) {
    this.ctx.save()
    this.ctx.translate(this.config.offsetX, this.config.offsetY)
    this.yaxis.drawCrosshairMark(y - this.config.offsetY)
    this.ctx.restore()
  }

  draw() {
    this.ctx.save()
    this.ctx.translate(this.config.offsetX, this.config.offsetY)
    this._drawSeparatorLine()
    this._drawYaxis()

    const scale = this.height / this.maxVolume
    this.ctx.scale(1, scale)
    this.items.forEach(item => {
      this.ctx.fillStyle =
        item.open > item.close ? this.config.downColor : this.config.upColor
      this.ctx.fillRect(
        item.x,
        this.maxVolume - item.volume,
        this.config.candleWidth,
        item.volume
      )
    })
    this.ctx.restore()
  }
}
