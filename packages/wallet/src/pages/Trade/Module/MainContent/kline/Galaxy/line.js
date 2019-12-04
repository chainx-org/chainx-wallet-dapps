export default class Line {
  constructor(context, startX, startY, endX, endY, style, width = 1) {
    this.context = context
    this.context.save()

    this.context.strokeStyle = style
    this.context.lineWidth = width
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
  }

  draw() {
    this.context.beginPath()
    this.context.moveTo(this.startX, this.startY)
    this.context.lineTo(this.endX, this.endY)
    this.context.closePath()
    this.context.stroke()
    this.context.restore()
  }
}
