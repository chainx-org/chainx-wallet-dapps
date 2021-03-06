import { createSelector } from '@reduxjs/toolkit'
import { token } from '../../../utils/constants'
import { sdotPrecisionSelector } from '../../selectors/assets'

export const assetsInfoSelector = state => {
  return state.assets.assetsInfo
}

export const xbtcMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === token.XBTC) || {}
  }
)

export const lbtcMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === token.LBTC) || {}
  }
)

export const sdotMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === token.SDOT) || {}
  }
)

export const assetsSelector = state => {
  return state.assets.assets
}

function normalizeAsset(assets, token) {
  const asset = assets.find(asset => asset.name === token)
  if (!asset) {
    return { details: {} }
  }

  const total = Object.values(asset.details).reduce(
    (result, value) => result + value,
    0
  )
  return {
    ...asset,
    details: {
      total,
      ...asset.details
    }
  }
}

export const xbtcAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return normalizeAsset(assets, token.XBTC)
  }
)

export const lbtcAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return normalizeAsset(assets, token.LBTC)
  }
)

export const sdotAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return normalizeAsset(assets, token.SDOT)
  }
)

export const xbtcFreeSelector = createSelector(
  xbtcAssetSelector,
  xbtc => {
    return xbtc.details.free
  }
)

export const sdotFreeSelector = createSelector(
  sdotPrecisionSelector,
  sdotAssetSelector,
  (precision, asset) => {
    return precision !== null && asset
      ? { free: asset.details.free, precision }
      : {}
  }
)
