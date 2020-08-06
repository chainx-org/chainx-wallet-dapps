import React, { useEffect, useState } from 'react'
import Card from '../../../components/Card'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAccountAssets,
  fetchAssetsInfo
} from '../../../reducers/assetSlice'
import AssetView from './AssetView'
import $t from '../../../locale'
import Logo from './Logo'
import AccountInfo from './AccountInfo'
import backgroundImg from './background.svg'
import { WhiteButton } from '@chainx/ui'
import { addressSelector } from '../../../reducers/addressSlice'
import { pcxAssetSelector } from '@reducers/assetSlice'

const InnerWrapper = styled.div`
  position: relative;
  opacity: 0.8;
  background-image: linear-gradient(90deg, #ffe981 0%, #f6ca4a 100%);
  border-radius: 10px;
  padding: 16px;
  min-height: 222px;

  header {
    display: flex;
    justify-content: space-between;
  }

  section.free {
    display: flex;
    margin-top: 10px;
    align-items: flex-end;
  }

  section.details {
    display: flex;
    margin-top: 32px;
    & > div:not(:first-of-type) {
      margin-left: 66px;
    }
  }
`

const CornerBackground = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  background-image: url(${backgroundImg});
  width: 179px;
  height: 147px;
  opacity: 0.2;
`

export default function() {
  const address = useSelector(addressSelector)

  const pcxAsset = useSelector(pcxAssetSelector)
  console.log('pcxAsset', pcxAsset)

  const { details: { free, reservedDexSpot } = {}, details, total, precision } =
    pcxAsset || {}

  // const pcxFree = useSelector(pcxFreeSelector)
  // const pcxDetails = useSelector(pcxDetailsSelector)
  const dispatch = useDispatch()
  const [, setTransferOpen] = useState(false)

  console.log('address', address)

  useEffect(() => {
    dispatch(fetchAccountAssets(address))
  }, [dispatch, address])

  useEffect(() => {
    dispatch(fetchAssetsInfo())
  }, [dispatch])

  // const handleTransferClose = extrinsic => {
  //   setTransferOpen(false)
  // }
  //
  return (
    <Card>
      <InnerWrapper>
        <header>
          <Logo />
          <AccountInfo />
        </header>
        <section className="free">
          {free && (
            <AssetView
              bold
              title={$t('ASSET_FREE')}
              value={free}
              precision={precision}
            />
          )}
          <WhiteButton
            onClick={() => setTransferOpen(true)}
            style={{ marginLeft: 32, height: 28, marginBottom: 4 }}
          >
            {$t('TRANSFER')}
          </WhiteButton>
        </section>
        <section className="details">
          {details && (
            <>
              <AssetView
                title={$t('ASSET_TOTAL')}
                value={total}
                precision={precision}
              />
              <AssetView
                title={$t('ASSET_RESERVED_DEX_SPOT')}
                value={reservedDexSpot}
                precision={precision}
              />
              {/*<AssetView*/}
              {/*  title={$t('ASSET_RESERVED_STAKING')}*/}
              {/*  value={pcxDetails.reservedStaking}*/}
              {/*  precision={pcxFree.precision}*/}
              {/*/>*/}
              {/*<AssetView*/}
              {/*  title={$t('ASSET_RESERVED_REVOCATION')}*/}
              {/*  value={pcxDetails.reservedStakingRevocation}*/}
              {/*  precision={pcxFree.precision}*/}
              {/*/>*/}
            </>
          )}
        </section>
        <CornerBackground />
        {/*{transferOpen && (*/}
        {/*  <TransferDialog token="PCX" handleClose={handleTransferClose} />*/}
        {/*)}*/}
      </InnerWrapper>
    </Card>
  )
}
