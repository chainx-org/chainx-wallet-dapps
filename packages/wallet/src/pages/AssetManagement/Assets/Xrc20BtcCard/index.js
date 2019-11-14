import React, { useEffect, useState } from 'react'
import AssetCard from '../components/AssetCard'
import logo from './xrc20-btc.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchXrcBtcBalance,
  fetchXrcBtcInfo,
  xrcBtcBalanceSelector
} from '../../../../reducers/xrcBtcSlice'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import { AssetLine, DetailWrapper } from '../components/common'
import $t from '../../../../locale'
import AssetView from '../components/AssetView'
import { PrimaryButton } from '@chainx/ui'
import ConvertDialog from './ConvertDialog'

export default function() {
  const meta = {
    name: 'XRC20-BTC',
    tokenName: 'ChainX XRC20 BTC',
    precision: 8
  }

  const balance = useSelector(xrcBtcBalanceSelector)

  const address = useSelector(addressSelector)
  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address)
  const [dialogOpen, setDialogOpen] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchXrcBtcBalance(accountId))
    dispatch(fetchXrcBtcInfo())
  }, [dispatch, accountId])

  const footer = (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <PrimaryButton
        onClick={() => setDialogOpen(true)}
        style={{ marginRight: 8 }}
      >
        {$t('ASSET_CONVERT')}
      </PrimaryButton>
    </div>
  )

  return (
    <AssetCard
      meta={meta}
      logo={logo}
      details={{ free: balance }}
      footer={footer}
    >
      <DetailWrapper>
        <AssetLine>
          <AssetView
            title={$t('ASSET_TOTAL')}
            value={balance}
            precision={meta.precision}
          />
        </AssetLine>
      </DetailWrapper>
      {dialogOpen && <ConvertDialog handleClose={() => setDialogOpen(false)} />}
    </AssetCard>
  )
}
