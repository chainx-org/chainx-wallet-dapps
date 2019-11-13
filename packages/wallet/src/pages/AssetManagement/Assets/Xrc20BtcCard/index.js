import React, { useEffect } from 'react'
import AssetCard from '../components/AssetCard'
import logo from './xrc20-btc.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchXrcBtcBalance,
  xrcBtcBalanceSelector
} from '../../../../reducers/xrcBtcSlice'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import { AssetLine, DetailWrapper } from '../components/common'
import $t from '../../../../locale'
import AssetView from '../components/AssetView'

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

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchXrcBtcBalance(accountId))
  }, [dispatch, accountId])

  return (
    <AssetCard meta={meta} logo={logo} details={{ free: balance }}>
      <DetailWrapper>
        <AssetLine>
          <AssetView
            title={$t('ASSET_TOTAL')}
            value={balance}
            precision={meta.precision}
          />
        </AssetLine>
      </DetailWrapper>
    </AssetCard>
  )
}
