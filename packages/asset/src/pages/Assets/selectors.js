import { createSelector } from 'redux-starter-kit'

export const assetsInfoSelector = state => {
  return state.assets.assetsInfo
}

export const xbtcMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === 'BTC') || {}
  }
)

export const lbtcMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === 'L-BTC') || {}
  }
)

export const sdotMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === 'SDOT') || {}
  }
)

export const assetsSelector = state => {
  return state.assets.assets
}

export const xbtcAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return assets.find(asset => asset.name === 'BTC') || { details: {} }
  }
)

export const lbtcAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return assets.find(asset => asset.name === 'L-BTC') || { details: {} }
  }
)

export const sdotAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return assets.find(asset => asset.name === 'SDOT') || { details: {} }
  }
)
