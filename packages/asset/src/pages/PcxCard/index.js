import React, { useEffect } from 'react'
import Card from '../../components/Card'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAccountAssets, fetchAssetsInfo } from '../../reducers/assetSlice'
import { pcxDetailsSelector, pcxFreeSelector } from './selectors'
import AssetView from './AssetView'

const InnerWrapper = styled.div`
  opacity: 0.8;
  background-image: linear-gradient(90deg, #ffe981 0%, #f6ca4a 100%);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 16px;

  section.details {
    display: flex;
    margin-top: 32px;
    & > div:not(:first-of-type) {
      margin-left: 66px;
    }
  }
`

export default function() {
  const { address } = useSelector(state => state.address)
  const pcxFree = useSelector(pcxFreeSelector)
  const pcxDetails = useSelector(pcxDetailsSelector)
  console.log('details', pcxDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAccountAssets(address))
  }, [dispatch, address])

  useEffect(() => {
    dispatch(fetchAssetsInfo())
  }, [dispatch])

  return (
    <Card>
      <InnerWrapper>
        <section className="free">
          {pcxFree && (
            <AssetView
              bold
              title={'可用余额'}
              value={pcxFree.free}
              precision={pcxFree.precision}
            />
          )}
        </section>
        <section className="details">
          {pcxDetails && (
            <>
              <AssetView
                title={'总余额'}
                value={pcxDetails.total}
                precision={pcxFree.precision}
              />
              <AssetView
                title={'交易冻结'}
                value={pcxDetails.reservedDexSpot}
                precision={pcxFree.precision}
              />
              <AssetView
                title={'投票冻结'}
                value={pcxDetails.reservedStaking}
                precision={pcxFree.precision}
              />
              <AssetView
                title={'赎回冻结'}
                value={pcxDetails.reservedStakingRevocation}
                precision={pcxFree.precision}
              />
            </>
          )}
        </section>
      </InnerWrapper>
    </Card>
  )
}
