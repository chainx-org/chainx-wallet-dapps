import React, { useEffect } from 'react'
import TableHead from './Head'
import { useDispatch, useSelector } from 'react-redux'
import Content from './Content'
import { Empty } from '../../../../components'
import { getAccountOrders, ordersSelector } from '@reducers/dexSlice'
import { addressSelector } from '@reducers/addressSlice'
import $t from '../../../../locale'

export default function() {
  const address = useSelector(addressSelector)
  const orders = useSelector(ordersSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getAccountOrders(address))
    }, 5000)

    return () => clearInterval(intervalId)
  }, [dispatch, address])

  useEffect(() => {
    dispatch(getAccountOrders(address))
  }, [dispatch, address])

  return (
    <>
      <TableHead />
      {orders.data.length > 0 ? (
        <Content />
      ) : (
        <Empty
          text={$t('TRADE_ORDERS_NONE')}
          style={{ marginTop: 30, marginBottom: 30 }}
        />
      )}
    </>
  )
}
