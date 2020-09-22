import React, { useEffect } from 'react'
import TableHead from './Head'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import {
  fetchHistoryOrders,
  historyOrdersSelector
} from '../../../../reducers/tradeSlice'
import Content from './Content'
import { Empty } from '../../../../components'

export default function() {
  const address = useSelector(addressSelector)
  const chainx = getChainx()
  const accountId = address
  const orders = useSelector(historyOrdersSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchHistoryOrders(accountId))
  }, [dispatch, accountId])

  return (
    <>
      {orders.length > 0 ? (
        <>
          <Content />
        </>
      ) : (
        <>
          <TableHead />
          <Empty
            text="无历史委托"
            style={{ marginTop: 30, marginBottom: 30 }}
          />
        </>
      )}
    </>
  )
}
