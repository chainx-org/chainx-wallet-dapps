import React from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableRow } from '@chainx/ui'
import { toPrecision } from '../../../../utils'
import {
  OrderAmountCell,
  OrderPriceCell,
  SumCell,
  TableWrapper
} from './Wrapper'
import EventEmitter, { events } from '../eventEmitter'
import { currentPairSelector } from '@reducers/dexSlice'
import { currentPairAssetPrecisionSelector } from '@pages/Trade/Module/AskBid/dexSelectors'

export default function({ orders, isAsk }) {
  const pair = useSelector(currentPairSelector)
  const { pipDecimals: precision, tickDecimals: unitPrecision } = pair || {
    precision: 0,
    unitPrecision: 0
  }
  const assetPrecision = useSelector(currentPairAssetPrecisionSelector)

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
