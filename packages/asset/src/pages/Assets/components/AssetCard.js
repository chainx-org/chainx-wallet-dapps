import React from 'react'
import Card from './CardWrapper'
import Logo from './Logo'
import AssetView from './AssetView'

export default function(props) {
  const { meta, details, logo } = props
  const showAsset =
    props.meta.precision && Object.keys(props.details).length > 0

  const name = meta.name === 'BTC' ? 'X-BTC' : meta.name

  return (
    <Card>
      <header>
        <Logo logo={logo} name={name} tokenName={meta.tokenName} />
      </header>
      {showAsset && (
        <AssetView
          title="Balance"
          value={details.free}
          precision={meta.precision}
          bold
        />
      )}
      {props.children}
    </Card>
  )
}
