import React from 'react'
import { useSelector } from 'react-redux'
import { historyOrdersSelector } from '../../../../reducers/tradeSlice'
import { TableBody, TableRow } from '@chainx/ui'
import { BaseCell } from '../../../Trade/Orders/UserOrders/Wrapper'
import $t from '../../../../locale'
import { Amount } from '@components'

export default function() {
  const orders = useSelector(historyOrdersSelector)

  return (
    <TableBody>
      {orders.map((order, index) => {
        return (
          <TableRow key={index}>
            <BaseCell style={{ width: '50%' }}>
              <Amount value={order.turnover} precision={8} />
            </BaseCell>
            <BaseCell style={{ width: '25%' }}>
              <Amount value={order.turnover} precision={8} />
            </BaseCell>
            <BaseCell style={{ width: '25%' }}>
              <Amount value={order.turnover} precision={8} />
            </BaseCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}
