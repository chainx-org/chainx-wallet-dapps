import React from 'react'
import Logo from '../Logo'
import xbtcLogo from './xbtc.svg'
import { useSelector } from 'react-redux'
import { xbtcMetaSelector, xbtcAssetSelector } from '../selectors'
import AssetView from '../AssetView'
import Card from '../CardWrapper'

export default function() {
  const meta = useSelector(xbtcMetaSelector)
  const { details } = useSelector(xbtcAssetSelector)

  const showAsset = meta.precision && Object.keys(details).length > 0

  return (
    <Card>
      <header>
        <Logo logo={xbtcLogo} name="X-BTC" tokenName={meta.tokenName} />
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
