import React from 'react'
import sdotLogo from './sdot.svg'
import { useSelector } from 'react-redux'
import { sdotAssetSelector, sdotMetaSelector } from '../selectors'
import AssetCard from '../components/AssetCard'

export default function() {
  const meta = useSelector(sdotMetaSelector)
  const { details } = useSelector(sdotAssetSelector)

  return <AssetCard meta={meta} details={details} logo={sdotLogo} />
}
