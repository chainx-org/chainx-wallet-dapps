import { createSelector } from 'redux-starter-kit'
import { token } from '../../utils/constants'

export const assetsInfoSelector = state => {
  return state.assets.assetsInfo
}

export const pseduIntentionSelector = state => {
  return state.intentions.pseduIntentions
}

const generatePrecisionSelector = function(token) {
  return createSelector(
    assetsInfoSelector,
    assets => {
      const asset = assets.find(asset => asset.name === token)
      return asset ? asset.precision : null
    }
  )
}

export const xbtcPrecisionSelector = generatePrecisionSelector(token.XBTC)
export const lbtcPrecisionSelector = generatePrecisionSelector(token.LBTC)
export const sdotPrecisionSelector = generatePrecisionSelector(token.SDOT)
export const pcxPrecisionSelector = generatePrecisionSelector(token.PCX)

const generateIntentionSelector = function(token) {
  return createSelector(
    pseduIntentionSelector,
    intentions => {
      return intentions.find(intention => intention.id === token) || null
    }
  )
}

export const xbtcIntentionSelector = generateIntentionSelector(token.XBTC)
export const lbtcIntentionSelector = generateIntentionSelector(token.LBTC)
export const sdotIntentionSelector = generateIntentionSelector(token.SDOT)

const generateSelector = function(intention, tokenPrecision, pcxPrecision) {
  return createSelector(
    intention,
    tokenPrecision,
    pcxPrecision,
    (intention, tokenPrecision, pcxPrecision) => {
      if (!intention || tokenPrecision === null || pcxPrecision === null) {
        return {}
      }

      const circulation = intention.circulation / Math.pow(10, tokenPrecision)
      const power = intention.power / Math.pow(10, tokenPrecision)
      const vote = Number((circulation * power).toFixed(pcxPrecision))
      const jackpot = intention.jackpot / Math.pow(10, pcxPrecision)

      return {
        circulation,
        power,
        vote,
        jackpot
      }
    }
  )
}

export const normalizedXbtcSelector = generateSelector(
  xbtcIntentionSelector,
  xbtcPrecisionSelector,
  pcxPrecisionSelector
)
export const normalizedLbtcSelector = generateSelector(
  lbtcIntentionSelector,
  lbtcPrecisionSelector,
  pcxPrecisionSelector
)
export const normalizedSdotSelector = generateSelector(
  sdotIntentionSelector,
  sdotPrecisionSelector,
  pcxPrecisionSelector
)
