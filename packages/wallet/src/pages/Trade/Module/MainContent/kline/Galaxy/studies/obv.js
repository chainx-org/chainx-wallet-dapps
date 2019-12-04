import { OBV as obvCalculator } from 'technicalindicators'
import Study from './study'

export default class OBV extends Study {
  constructor(galaxy) {
    super(galaxy)

    this.name = 'OBV'
    this.values = this._calcValues()
    this.toDrawValues = this._getToDrawValues()
    this.offset = galaxy.chosenItems.length - this.toDrawValues.length
  }

  _calcValues() {
    const close = this.galaxy.items.map(item => item.close)
    const volume = this.galaxy.items.map(item => item.volume)
    return obvCalculator.calculate({ close, volume })
  }

  draw() {
    const ctx = this.galaxy.ctx
    ctx.save()
    ctx.translate(0, this.y + this.headerHeight)
    this._drawLine(ctx)
    this._drawYaxixMarks(ctx)

    ctx.restore()

    this._drawBadge()
  }

  _drawLine(ctx) {
    ctx.save()
    ctx.translate(this.offset * this.oneValueSpace, 0)

    ctx.strokeStyle = '#A4A4A4'

    this.maxValue = Math.max(...this.toDrawValues)
    this.minValue = Math.min(...this.toDrawValues)
    // TODO: extent不可以为0，需要处理extent为0的特殊情况
    this.extent = this.maxValue - this.minValue

    ctx.beginPath()
    this.toDrawValues.forEach((value, index) => {
      const x = index * this.oneValueSpace
      const y = ((this.maxValue - value) / this.extent) * this.contentHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    ctx.restore()
  }
}
