import { CCI as calculator } from 'technicalindicators'
import Study from './study'

const defaultConfig = { period: 20 }

export default class CCI extends Study {
  constructor(galaxy, config = defaultConfig) {
    super(galaxy)
    const open = galaxy.items.map(item => item.open)
    const high = galaxy.items.map(item => item.high)
    const low = galaxy.items.map(item => item.low)
    const close = galaxy.items.map(item => item.close)

    this.config = Object.assign({}, defaultConfig, config)
    this.name = `CCI(${this.config.period})`

    this.values = calculator.calculate({
      open,
      high,
      low,
      close,
      period: this.config.period
    })
    this.toDrawValues = this._getToDrawValues()
    this.offset = galaxy.chosenItems.length - this.toDrawValues.length

    this.maxValue = Math.max(...this.toDrawValues)
    this.minValue = Math.min(...this.toDrawValues)
    this.extent = this.maxValue - this.minValue
  }

  draw() {
    if (this.toDrawValues.length < 0) {
      this._drawBadge()
      return
    }

    const normalizedValues = this.toDrawValues.map((value, index) => ({
      x: (this.offset + index) * this.oneValueSpace,
      y: ((this.maxValue - value) / this.extent) * this.contentHeight
    }))

    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.y + this.headerHeight)
    ctx.strokeStyle = '#A4A4A4'

    ctx.beginPath()
    normalizedValues.forEach((value, index) => {
      if (index === 0) {
        ctx.moveTo(value.x, value.y)
      } else {
        ctx.lineTo(value.x, value.y)
      }
    })
    ctx.stroke()

    this._drawYaxixMarks(ctx)
    ctx.restore()
    this._drawBadge()
  }
}
