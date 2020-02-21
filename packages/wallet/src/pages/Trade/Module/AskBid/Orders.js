import React from 'react'
import { useSelector } from 'react-redux'
import { currentPairSelector } from '../../../../reducers/tradeSlice'
import { Table, TableBody, TableRow } from '@chainx/ui'
import { currentPairAssetInfo } from '../selectors'
import { toPrecision } from '../../../../utils'
import {
  OrderAmountCell,
  OrderPriceCell,
  SumCell,
  TableWrapper
} from './Wrapper'
import EventEmitter, { events } from '../eventEmitter'

export default function({ orders, isAsk }) {
  const pair = useSelector(currentPairSelector)
  const { precision, unitPrecision } = pair || {
    precision: 0,
    unitPrecision: 0
  }
  const { precision: assetPrecision } = useSelector(currentPairAssetInfo) || {}

  return (
    <TableWrapper
      style={{ flexDirection: isAsk ? 'column-reverse' : 'column' }}
    >
      <Table>
        <TableBody>
          {orders.map((order, index) => {
            const price = Number(toPrecision(order.price, precision)).toFixed(
              precision - unitPrecision
            )

            return (
              <TableRow key={index}>
                <OrderPriceCell
                  height={24}
                  onClick={() =>
                    EventEmitter.dispatch(events.priceClicked, price)
                  }
                >
                  {price}
                </OrderPriceCell>
                <OrderAmountCell
                  value={order.amount}
                  precision={assetPrecision}
                  height={24}
                />
                <SumCell height={24}>
                  {toPrecision(order.sumAmount, assetPrecision)}
                </SumCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableWrapper>
  )
}
