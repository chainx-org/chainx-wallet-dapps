import SMA from '../studies/sma'

export default class CandleMa {
  constructor(galaxy) {
    this.galaxy = galaxy

    this.maMap = {}

    const arr = [5, 10, 20]
    const maxMinArr = []
    arr.forEach(n => {
      const sma = new SMA(this.galaxy, this.galaxy.items, n)
      this.maMap['ma' + n] = sma
      maxMinArr.push(sma.getMaxMinValue())
    })

    this.max = Math.max(...maxMinArr.map(item => item.max))
    this.min = Math.min(...maxMinArr.map(item => item.min))
  }

  draw() {
    ;[5, 10, 20].forEach(n => {
      const sma = this.maMap['ma' + n]
      sma.draw()
    })
  }

  getCrosshairValue() {
    return [5, 10, 20].reduce((result, n) => {
      const key = `ma${n}`
      const sma = this.maMap[key]
      result[key] = sma.getCrosshairValue(this.galaxy.crossIndex)
      return result
    }, {})
  }
}
