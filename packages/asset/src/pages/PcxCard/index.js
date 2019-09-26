import React, { useEffect } from 'react'
import Card from '../../components/Card'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAccountAssets, fetchAssetsInfo } from '../../reducers/assetSlice'
import { pcxFreeSelector } from './selectors'
import AssetView from './AssetView'

const InnerWrapper = styled.div`
  opacity: 0.8;
  background-image: linear-gradient(90deg, #ffe981 0%, #f6ca4a 100%);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 16px;
`

export default function() {
  const { address } = useSelector(state => state.address)
  const pcxFree = useSelector(pcxFreeSelector)
  console.log('free', pcxFree)
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
              title={'可用余额'}
              value={pcxFree.free}
              precision={pcxFree.precision}
            ></AssetView>
          )}
        </section>
      </InnerWrapper>
    </Card>
  )
}
