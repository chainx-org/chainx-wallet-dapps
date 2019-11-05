import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { lbtcAssetSelector, lbtcMetaSelector } from '../selectors'
import AssetCard from '../components/AssetCard'
import lbtcLogo from '../../../../static/lbtc.svg'
import { AssetLine, DetailWrapper } from '../components/common'
import InfoView from '../components/InfoView'
import $t from '../../../../locale'
import AssetView from '../components/AssetView'
import { PrimaryButton, DefaultButton } from '@chainx/ui'
import LockDialog from './LockDialog'

export default function() {
  const meta = useSelector(lbtcMetaSelector)
  const { details } = useSelector(lbtcAssetSelector)
  const showDetails = meta.precision && Object.keys(details).length > 0
  const [lockOpen, setLockOpen] = useState(false)

  const footer = (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <PrimaryButton
        onClick={() => setLockOpen(true)}
        style={{ marginRight: 8 }}
      >
        {$t('LOCK')}
      </PrimaryButton>
      <DefaultButton
        disabled={true}
        onClick={() => console.log('click')}
        style={{ marginRight: 8 }}
      >
        {$t('VIEW')}
      </DefaultButton>
    </div>
  )

  return (
    <AssetCard meta={meta} details={details} logo={lbtcLogo} footer={footer}>
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
          </DetailWrapper>
        )}
      </div>
      {lockOpen ? <LockDialog handleClose={() => setLockOpen(false)} /> : null}
    </AssetCard>
  )
}
