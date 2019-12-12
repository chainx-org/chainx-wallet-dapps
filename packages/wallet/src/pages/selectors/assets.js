import { createSelector } from '@reduxjs/toolkit'
import { token } from '../../utils/constants'
import { addressSelector } from '../../reducers/addressSlice'
import { getChainx } from '../../services/chainx'

export const assetsInfoSelector = state => {
  return state.assets.assetsInfo
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
export const accountIdSelector = createSelector(
  addressSelector,
  address => {
    if (!address) {
      return null
    }

    const chainx = getChainx()
    return chainx.account.decodeAddress(address, false)
  }
)
