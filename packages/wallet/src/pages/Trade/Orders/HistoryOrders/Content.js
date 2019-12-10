import React from 'react'
import { useSelector } from 'react-redux'
import { historyOrdersSelector } from '../../../../reducers/tradeSlice'
import { Table, TableBody, TableRow } from '@chainx/ui'
import {
  pairAssetPrecision,
  pairCurrencyPrecision
} from '../../Module/selectors'
import { toPrecision } from '../../../../utils'
import {
  FillCell,
  IndexCell,
  NumberCell,
  PairCell,
  TimeCell
} from '../UserOrders/Wrapper'
import moment from 'moment'
import { StatCell } from '../Wrapper'

export default function() {
  const orders = useSelector(historyOrdersSelector)
  const assetPrecision = useSelector(pairAssetPrecision)
  const currencyPrecision = useSelector(pairCurrencyPrecision)

  return (
    <Table>
      <TableBody>
        {orders.map((order, index) => {
          const currencyPair = order['pair.currency_pair']
          const amount = toPrecision(order.amount, assetPrecision)
          const precision = order['pair.precision']
          const unitPrecision = order['pair.unit_precision']
          const fillPercentage = Number(
            (order.hasfill_amount / order.amount) * 100
          ).toFixed(2)
          const showPrecision = precision - unitPrecision
          const price = toPrecision(order.price, precision, false).toFixed(
            showPrecision
          )
          const fillAveragePrice = toPrecision(
            order.fill_aver,
            precision,
            false
          ).toFixed(showPrecision)
          // 成交总额
          const totalFillCurrency = toPrecision(
            order.fill_aver * order.hasfill_amount,
            precision + currencyPrecision,
            false
          ).toFixed(currencyPrecision)

          return (
            <TableRow key={index}>
              <TimeCell style={{ width: '12%' }}>
                <div>
                  <span className={order.direction} />
                  <span className="time">
                    {moment(order['block.time']).format('YYYY/MM/DD HH:mm')}
                  </span>
                </div>
              </TimeCell>
              <IndexCell style={{ width: '5%' }}>{order.id}</IndexCell>
              <PairCell style={{ width: '8%' }}>{`${currencyPair[0]} / ${
                currencyPair[1]
              }`}</PairCell>
              <NumberCell style={{ width: '11%' }}>
                {price + ' '}
                <span>{currencyPair[1]}</span>
              </NumberCell>
              <NumberCell style={{ width: '14%' }}>
                {amount + ' '}
                <span>{currencyPair[0]}</span>
              </NumberCell>
              <FillCell
                style={{ width: '15%' }}
                className={order.hasfill_amount <= 0 ? 'zero' : order.direction}
              >
                <span className="amount">{`${toPrecision(
                  order.hasfill_amount,
                  assetPrecision
                )}`}</span>
                <span className="percentage"> / {fillPercentage}% </span>
              </FillCell>
              <NumberCell style={{ width: '11%' }}>
                {fillAveragePrice + ' '}
                <span>{currencyPair[1]}</span>
              </NumberCell>
              <NumberCell style={{ width: '15%' }}>
                {totalFillCurrency + ' '}
                <span>{currencyPair[1]}</span>
              </NumberCell>
              <StatCell>
                {order.status === 'Canceled'
                  ? '已撤销'
                  : order.status === 'Filled'
                  ? '完全成交'
                  : order.status === 'ParitialFillAndCanceled'
                  ? '部分成交已撤销'
                  : ''}
              </StatCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
