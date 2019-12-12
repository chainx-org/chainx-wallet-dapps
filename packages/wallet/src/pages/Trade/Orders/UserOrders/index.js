import React, { useEffect } from 'react'
import TableHead from './Head'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNowOrders, userOrders } from '../../../../reducers/tradeSlice'
import Content from './Content'
import { Empty } from '../../../../components'
import { accountIdSelector } from '../../../selectors/assets'

export default function() {
  const accountId = useSelector(accountIdSelector)
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
        <Empty text="暂无委托" style={{ marginTop: 30, marginBottom: 30 }} />
      )}
    </>
  )
}
