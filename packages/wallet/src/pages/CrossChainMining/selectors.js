import { createSelector } from 'redux-starter-kit'

export const assetsInfoSelector = state => {
  return state.assets.assetsInfo
}

export const pseduIntentionSelector = state => {
  return state.intentions.pseduIntentions
}

export const xbtcPrecisionSelector = createSelector(
  assetsInfoSelector,
  assets => {
    const asset = assets.find(asset => asset.name === 'BTC')
    return asset ? asset.precision : null
  }
)

export const lbtcPrecisionSelector = createSelector(
  assetsInfoSelector,
  assets => {
    const asset = assets.find(asset => asset.name === 'L-BTC')
    return asset ? asset.precision : null
  }
)

export const sdotPrecisionSelector = createSelector(
  assetsInfoSelector,
  assets => {
    const asset = assets.find(asset => asset.name === 'SDOT')
    return asset ? asset.precision : null
  }
)

export const pcxPrecisionSelector = createSelector(
  assetsInfoSelector,
  assets => {
    const asset = assets.find(asset => asset.name === 'PCX')

    return asset ? asset.precision : null
  }
)

export const xbtcIntentionSelector = createSelector(
  pseduIntentionSelector,
  intentions => {
    return intentions.find(intention => intention.id === 'BTC') || null
  }
)

export const lbtcIntentionSelector = createSelector(
  pseduIntentionSelector,
  intentions => {
    return intentions.find(intention => intention.id === 'L-BTC') || null
  }
)

export const sdotIntentionSelector = createSelector(
  pseduIntentionSelector,
  intentions => {
    return intentions.find(intention => intention.id === 'SDOT') || null
  }
)

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
