import React from 'react'
import { useSelector } from 'react-redux'
import { lbtcAssetSelector, lbtcMetaSelector } from '../selectors'
import AssetCard from '../components/AssetCard'
import lbtcLogo from './lbtc.svg'

export default function() {
  const meta = useSelector(lbtcMetaSelector)
  const { details } = useSelector(lbtcAssetSelector)

  return <AssetCard meta={meta} details={details} logo={lbtcLogo} />
}
