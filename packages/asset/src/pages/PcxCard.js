import React, { useEffect } from 'react'
import Card from '../components/Card'
import styled from 'styled-components'
import chainx from '../services/chainx'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAccountAssets, fetchAssetsInfo } from '../reducers/assetSlice'

const InnerWrapper = styled.div`
  opacity: 0.8;
  background-image: linear-gradient(90deg, #ffe981 0%, #f6ca4a 100%);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 16px;
`

export default function() {
  const { address } = useSelector(state => state.address)
  const dispatch = useDispatch()
  const assets = useSelector(state => state.assets)
  console.log('store assets:', assets)

  const { asset } = chainx

  asset
    .getAssets(0, 100)
    .then(resp => {
      console.log('assets:', resp)
    })
    .catch(console.error)

  useEffect(() => {
    dispatch(fetchAccountAssets(address))
  }, [asset, dispatch, address])

  useEffect(() => {
    dispatch(fetchAssetsInfo())
  }, [asset, dispatch])

  return (
    <Card>
      <InnerWrapper>This is the PCX card.</InnerWrapper>
    </Card>
  )
}
