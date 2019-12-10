import React, { useEffect } from 'react'
import TableHead from './Head'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import { fetchHistoryOrders } from '../../../../reducers/tradeSlice'
import Content from './Content'

export default function() {
  const address = useSelector(addressSelector)
  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address, false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchHistoryOrders(accountId))
  }, [dispatch, accountId])

  return (
    <>
      <TableHead />
      <Content />
    </>
  )
}
