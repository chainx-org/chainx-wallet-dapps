import React, { useEffect } from 'react'
import TableHead from './Head'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import {
  fetchHistoryOrders,
  historyOrdersSelector
} from '../../../../reducers/tradeSlice'
import Content from './Content'
import { Empty } from '../../../../components'
import $t from '../../../../locale'

export default function() {
  const address = useSelector(addressSelector)
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
            text={$t('TRADE_HISTORY_ORDERS_NONE')}
            style={{ marginTop: 30, marginBottom: 30 }}
          />
        </>
      )}
    </>
  )
}
