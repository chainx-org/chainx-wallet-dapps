import React, { useEffect } from 'react'
import TableHead from './Head'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import { fetchNowOrders, userOrders } from '../../../../reducers/tradeSlice'
import Content from './Content'
import { Empty } from '../../../../components'

export default function() {
  const address = useSelector(addressSelector)
  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address, false)
  const orders = useSelector(userOrders)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchNowOrders(accountId))
  }, [dispatch, accountId])

  return (
    <>
      <TableHead />
      {orders.length > 0 ? (
        <Content />
      ) : (
        <Empty text="暂无委托" style={{ marginTop: 30 }} />
      )}
    </>
  )
}
