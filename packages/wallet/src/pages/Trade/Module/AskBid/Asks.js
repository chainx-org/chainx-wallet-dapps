import React from 'react'
import { useSelector } from 'react-redux'
import { currentPairSelector } from '../../../../reducers/tradeSlice'
import { Table, TableBody, TableRow } from '@chainx/ui'
import { currentPairAssetInfo } from '../selectors'
import { toPrecision } from '../../../../utils'
import { normalizedAsksSelector } from './selectors'
import { OrderAmountCell, OrderPriceCell, SumCell } from './Wrapper'

export default function() {
  const asks = useSelector(normalizedAsksSelector)
  const pair = useSelector(currentPairSelector)
  const { precision, unitPrecision } = pair || {
    precision: 0,
    unitPrecision: 0
  }
  const { precision: assetPrecision } = useSelector(currentPairAssetInfo) || {}

  return (
    <Table>
      <TableBody>
        {asks.map((ask, index) => {
          const price = Number(toPrecision(ask.price, pair.precision)).toFixed(
            precision - unitPrecision
          )

          return (
            <TableRow key={index}>
              <OrderPriceCell height={24}>{price}</OrderPriceCell>
              <OrderAmountCell
                value={ask.amount}
                precision={assetPrecision}
                height={24}
              />
              <SumCell height={24}>
                {toPrecision(ask.sumAmount, assetPrecision)}
              </SumCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
