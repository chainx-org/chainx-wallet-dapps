import { createSelector } from 'redux-starter-kit'

export const assetsSelector = state => {
  return state.assets.assetsInfo
}

export const xbtcSelector = createSelector(
  assetsSelector,
  assets => {
    return assets.find(asset => asset.name === 'BTC') || {}
  }
)

export const lbtcSelector = createSelector(
  assetsSelector,
  assets => {
    return assets.find(asset => asset.name === 'L-BTC') || {}
  }
)

export const sdotSelector = createSelector(
  assetsSelector,
  assets => {
    return assets.find(asset => asset.name === 'SDOT') || {}
  }
)
