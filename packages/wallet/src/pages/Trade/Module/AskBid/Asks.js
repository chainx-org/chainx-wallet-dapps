import React from 'react'
import { useSelector } from 'react-redux'
import { currentPairSelector } from '../../../../reducers/tradeSlice'
import { Table, TableBody, TableHead, TableRow } from '@chainx/ui'
import HeadCell from '../components/HeadCell'
import { currentPairAssetInfo } from '../selectors'
import { toPrecision } from '../../../../utils'
import { normalizedAsksSelector } from './selectors'
import { OrderAmountCell, OrderPriceCell, SumCell } from './Wrapper'

export default function() {
  const asks = useSelector(normalizedAsksSelector)
  console.log('asks', asks)
  const pair = useSelector(currentPairSelector)
  const { precision: assetPrecision } = useSelector(currentPairAssetInfo) || {}

  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeadCell>价格</HeadCell>
          <HeadCell>数量 (PCX)</HeadCell>
          <HeadCell style={{ textAlign: 'right' }}>累计 (PCX)</HeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {asks.map((ask, index) => {
          const { precision, unitPrecision } = pair || {
            precision: 0,
            unitPrecision: 0
          }
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
