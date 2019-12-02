import React from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableRow } from '@chainx/ui'

import { normalizedBidsSelector } from './selectors'
import { currentPairSelector } from '../../../../reducers/tradeSlice'
import { currentPairAssetInfo } from '../selectors'
import { OrderAmountCell, OrderPriceCell, SumCell } from './Wrapper'
import { toPrecision } from '../../../../utils'

export default function() {
  const bids = useSelector(normalizedBidsSelector)
  const pair = useSelector(currentPairSelector)
  const { precision, unitPrecision } = pair || {
    precision: 0,
    unitPrecision: 0
  }

  const { precision: assetPrecision } = useSelector(currentPairAssetInfo) || {}

  return (
    <Table>
      <TableBody>
        {bids.map((bid, index) => {
          const price = Number(toPrecision(bid.price, pair.precision)).toFixed(
            precision - unitPrecision
          )

          return (
            <TableRow key={index}>
              <OrderPriceCell height={24}>{price}</OrderPriceCell>
              <OrderAmountCell
                value={bid.amount}
                precision={assetPrecision}
                height={24}
              />
              <SumCell height={24}>
                {toPrecision(bid.sumAmount, assetPrecision)}
              </SumCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
