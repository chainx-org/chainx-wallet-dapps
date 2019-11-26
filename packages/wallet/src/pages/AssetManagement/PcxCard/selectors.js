import { createSelector } from '@reduxjs/toolkit'

export const pcxPrecisionSelector = state => {
  const pcxInfo = state.assets.assetsInfo.find(info => info.name === 'PCX')
  return pcxInfo ? pcxInfo.precision : null
}

export const pcxAssetSelector = state => {
  const asset = state.assets.assets.find(asset => asset.name === 'PCX')
  return asset ? asset.details : null
}

export const pcxFreeSelector = createSelector(
  pcxPrecisionSelector,
  pcxAssetSelector,
  (precision, asset) => {
    return precision !== null && asset ? { free: asset.free, precision } : null
  }
)

export const pcxDetailsSelector = createSelector(
  pcxPrecisionSelector,
  pcxAssetSelector,
  (precision, asset) => {
    if (precision !== null && asset) {
      const total = Object.values(asset).reduce(
        (result, value) => result + value,
        0
      )
      return {
        total,
        ...asset,
        precision
      }
    }

    return null
  }
)

export const pcxInfoSelector = state => {
  const pcxInfo = state.assets.assetsInfo.find(info => info.name === 'PCX')

  return pcxInfo || {}
}
