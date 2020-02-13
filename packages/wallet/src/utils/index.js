import BigNumber from 'bignumber.js'
import chunk from 'lodash.chunk'
import { store } from '../index'
import { isExtensionSelector, isSignerSelector } from '../reducers/addressSlice'

export function toPrecision(value, precision = 0, paddingZero = true) {
  precision = Number(precision)
  const big = new BigNumber(value).dividedBy(Math.pow(10, precision))

  if (paddingZero) {
    return big.toFixed(precision)
  } else {
    return big.toNumber()
  }
}

export function normalizeNumber(num, precision = 0) {
  return Number(num.toFixed(precision))
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

export function getSeconds(date) {
  return parseInt((date.getTime() / 1000).toFixed(0))
}

export const noneFunc = () => {}

export const retry = async (func, times, second = 2) => {
  do {
    await new Promise(resolve => {
      setTimeout(() => {
        func()
        resolve()
      }, second * 1000)
    })
  } while (times-- > 0)
}

export const reverseHex = function(hex) {
  const normalizedHex = remove0xPrefix(hex)
  const chunks = chunk(normalizedHex.split(''), 2)
  const reversedHex = chunks.reduce((result, chunk) => {
    return result + chunk.join('')
  }, '')

  return ensure0xPrefix(reversedHex)
}

export const canRequestSign = function() {
  const state = store.getState()

  const isExtension = isExtensionSelector(state)
  const isSigner = isSignerSelector(state)

  return isSigner || (isExtension && window.chainxProvider)
}

export const sleep = (seconds = 3) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject({ timeout: true }), seconds * 1000)
  })
}
