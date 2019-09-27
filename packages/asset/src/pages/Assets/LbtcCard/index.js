import React from 'react'
import Logo from '../Logo'
import lbtcLogo from './lbtc.svg'
import { useSelector } from 'react-redux'
import { lbtcAssetSelector, lbtcMetaSelector } from '../selectors'
import Card from '../CardWrapper'
import AssetView from '../AssetView'

export default function() {
  const meta = useSelector(lbtcMetaSelector)
  const { details } = useSelector(lbtcAssetSelector)
  const showAsset = meta.precision && Object.keys(details).length > 0

  return (
    <Card>
      <header>
        <Logo logo={lbtcLogo} name={meta.name} tokenName={meta.tokenName} />
      </header>
      {showAsset && (
        <AssetView
          title="Balance"
          value={details.free}
          precision={meta.precision}
          bold
        />
      )}
    </Card>
  )
}
