import React from 'react'
import xbtcLogo from './xbtc.svg'
import { useSelector } from 'react-redux'
import { xbtcAssetSelector, xbtcMetaSelector } from '../selectors'
import AssetCard from '../components/AssetCard'

export default function() {
  const meta = useSelector(xbtcMetaSelector)
  const { details } = useSelector(xbtcAssetSelector)

  return <AssetCard meta={meta} details={details} logo={xbtcLogo} />
}
