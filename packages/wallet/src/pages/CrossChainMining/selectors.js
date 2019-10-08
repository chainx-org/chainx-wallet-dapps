import { createSelector } from 'redux-starter-kit'

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

export const xbtcPrecisionSelector = generatePrecisionSelector('BTC')
export const lbtcPrecisionSelector = generatePrecisionSelector('L-BTC')
export const sdotPrecisionSelector = generatePrecisionSelector('SDOT')
export const pcxPrecisionSelector = generatePrecisionSelector('PCX')

const generateIntentionSelector = function(token) {
  return createSelector(
    pseduIntentionSelector,
    intentions => {
      return intentions.find(intention => intention.id === token) || null
    }
  )
}

export const xbtcIntentionSelector = generateIntentionSelector('BTC')
export const lbtcIntentionSelector = generateIntentionSelector('L-BTC')
export const sdotIntentionSelector = generateIntentionSelector('SDOT')

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
