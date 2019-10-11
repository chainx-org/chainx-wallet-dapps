import React from 'react'
import sdotLogo from '../../../../staic/sdot.svg'
import { useSelector } from 'react-redux'
import { sdotAssetSelector, sdotMetaSelector } from '../selectors'
import AssetCard from '../components/AssetCard'
import { AssetLine, DetailWrapper } from '../components/common'
import InfoView from '../components/InfoView'
import $t from '../../../../locale'
import AssetView from '../components/AssetView'
import { PrimaryButton, DefaultButton } from '@chainx/ui'

export default function() {
  const meta = useSelector(sdotMetaSelector)
  const { details } = useSelector(sdotAssetSelector)
  const showDetails = meta.precision && Object.keys(details).length > 0

  const footer = (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <PrimaryButton
        onClick={() => console.log('click')}
        style={{ marginRight: 8 }}
      >
        {$t('MAP')}
      </PrimaryButton>
      <DefaultButton
        onClick={() => console.log('click')}
        style={{ marginRight: 8 }}
      >
        {$t('TRANSFER')}
      </DefaultButton>
    </div>
  )

  return (
    <AssetCard meta={meta} details={details} logo={sdotLogo} footer={footer}>
      <div className="details">
        {showDetails && (
          <DetailWrapper>
            <AssetLine>
              <InfoView title={$t('ASSET_CHAIN')} info={meta.chain} />
              <AssetView
                title={$t('ASSET_TOTAL')}
                value={details.total}
                precision={meta.precision}
              />
            </AssetLine>
            <AssetLine>
              <AssetView
                title={$t('ASSET_RESERVED_DEX_SPOT')}
                value={details.reservedDexSpot}
                precision={meta.precision}
              />
            </AssetLine>
          </DetailWrapper>
        )}
      </div>
    </AssetCard>
  )
}
