import React from 'react'
import Logo from '../Logo'
import sdotLogo from './sdot.svg'
import { useSelector } from 'react-redux'
import { sdotAssetSelector, sdotMetaSelector } from '../selectors'
import Card from '../CardWrapper'
import AssetView from '../AssetView'

export default function() {
  const meta = useSelector(sdotMetaSelector)
  const { details } = useSelector(sdotAssetSelector)

  const showAsset = meta.precision && Object.keys(details).length > 0

  return (
    <Card>
      <header>
        <Logo logo={sdotLogo} name={meta.name} tokenName={meta.tokenName} />
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
