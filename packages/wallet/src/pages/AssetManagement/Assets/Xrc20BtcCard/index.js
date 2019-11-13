import React, { useEffect } from 'react'
import AssetCard from '../components/AssetCard'
import logo from './xrc20-btc.svg'
import { useDispatch } from 'react-redux'
import { fetchXrcBtcBalance } from '../../../../reducers/xrcBtcSlice'

export default function() {
  const meta = {
    name: 'XRC20-BTC',
    tokenName: 'ChainX XRC20 BTC',
    precision: 8
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchXrcBtcBalance())
  }, [dispatch])

  return (
    <AssetCard meta={meta} logo={logo} details={{}}>
      hello world
    </AssetCard>
  )
}
