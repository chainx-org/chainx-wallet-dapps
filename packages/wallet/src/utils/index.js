import BigNumber from 'bignumber.js'

export function toPrecision(value, precision = 0) {
  precision = Number(precision)
  return new BigNumber(value)
    .dividedBy(Math.pow(10, precision))
    .toFixed(precision)
}

export function ensure0xPrefix(str = '') {
  if (str.startsWith('0x')) {
    return str
  }

  return `0x${str}`
}

export function remove0xPrefix(str = '') {
  if (str.startsWith('0x')) {
    return str.substring(2)
  }

  return str
}
