import React from 'react'
import sdotLogo from '../../../../staic/sdot.svg'
import { useSelector } from 'react-redux'
import { sdotAssetSelector, sdotMetaSelector } from '../selectors'
import AssetCard from '../components/AssetCard'
import { AssetLine, DetailWrapper } from '../components/common'
import InfoView from '../components/InfoView'
import $t from '../../../../locale'
import AssetView from '../components/AssetView'

export default function() {
  const meta = useSelector(sdotMetaSelector)
  const { details } = useSelector(sdotAssetSelector)
  const showDetails = meta.precision && Object.keys(details).length > 0

  return (
    <AssetCard meta={meta} details={details} logo={sdotLogo}>
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
