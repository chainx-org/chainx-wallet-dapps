import React from 'react'
import { useSelector } from 'react-redux'
import { historyOrdersSelector } from '../../../../reducers/tradeSlice'
import { Table, TableBody, TableHead, TableRow } from '@chainx/ui'
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
import { HeadCell, StatCell } from '../Wrapper'
import $t from '../../../../locale'

export default function() {
  const orders = useSelector(historyOrdersSelector)
  const assetPrecision = useSelector(pairAssetPrecision)
  const currencyPrecision = useSelector(pairCurrencyPrecision)

  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeadCell style={{ width: '12%' }}>{$t('TRADE_DATE')}</HeadCell>
          <HeadCell style={{ width: '5%' }}>{$t('TRADE_INDEX')}</HeadCell>
          <HeadCell style={{ width: '8%' }}>{$t('TRADE_PAIR')}</HeadCell>
          <HeadCell style={{ width: '11%' }}>
            {$t('TRADE_ORDER_PRICE')}
          </HeadCell>
          <HeadCell style={{ width: '14%' }}>
            {$t('TRADE_ORDER_AMOUNT')}
          </HeadCell>
          <HeadCell style={{ width: '15%' }}>
            {$t('TRADE_ORDER_FILLED_PERCENT')}
          </HeadCell>
          <HeadCell style={{ width: '11%' }}>
            {$t('TRADE_ORDER_FILL_AVG_PRICE')}
          </HeadCell>
          <HeadCell style={{ width: '15%' }}>
            {$t('TRADE_ORDER_FILL_ALL_VOLUME')}
          </HeadCell>
          <HeadCell style={{ textAlign: 'right' }}>
            {$t('COMMON_STATUS')}
          </HeadCell>
        </TableRow>
      </TableHead>

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
                  ? $t('TRADE_ORDER_STATUS_CANCELED')
                  : order.status === 'Filled'
                  ? $t('TRADE_ORDER_STATUS_FILLED')
                  : order.status === 'ParitialFillAndCanceled'
                  ? $t('TRADE_ORDER_STATUS_PARTIAL_FILLED')
                  : ''}
              </StatCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
