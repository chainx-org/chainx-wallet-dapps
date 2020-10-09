import React from 'react'
import { useSelector } from 'react-redux'
import { historyOrdersSelector } from '../../../../reducers/tradeSlice'
import { Table, TableBody, TableHead, TableRow } from '@chainx/ui'
import {
  pairAssetPrecision,
  pairCurrencyPrecision
} from '../../Module/selectors'
import { toPrecision } from '../../../../utils'
import { NumberCell, BaseCell, TimeCell } from '../UserOrders/Wrapper'
import moment from 'moment'
import { HeadCell, StatCell } from '../Wrapper'
import $t from '../../../../locale'
import { Amount } from '@components'

export default function() {
  const orders = useSelector(historyOrdersSelector)
  const assetPrecision = useSelector(pairAssetPrecision)
  const currencyPrecision = useSelector(pairCurrencyPrecision)

  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeadCell style={{ width: '5%' }}>{$t('HISTORY_TRADE_ID')}</HeadCell>
          <HeadCell style={{ width: '8%' }}>
            {$t('HISTORY_TRADE_PRICE')}
          </HeadCell>
          <HeadCell style={{ width: '15%' }}>
            {$t('HISTORY_TRADE_TURNOVER')}
          </HeadCell>
          <HeadCell style={{ width: '11%' }}>
            {$t('HISTORY_TRADE_MAKER')}
          </HeadCell>
          <HeadCell style={{ width: '15%' }}>
            {$t('HISTORY_TRADE_MAKER_ORDER_ID')}
          </HeadCell>
          <HeadCell style={{ textAlign: 'right' }}>
            {$t('HISTORY_TRADE_TAKER')}
          </HeadCell>
          <HeadCell style={{ textAlign: 'right' }}>
            {$t('HISTORY_TRADE_TAKER_ORDER_ID')}
          </HeadCell>
          <HeadCell style={{ width: '12%' }}>{$t('TRADE_DATE')}</HeadCell>
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
              <BaseCell style={{ width: '5%' }}>
                {order.tradingHistoryIdx}
              </BaseCell>
              <BaseCell style={{ width: '11%' }}>
                <Amount
                  style={{ opacity: 0.32 }}
                  value={order.price}
                  precision={8}
                />
              </BaseCell>
              <BaseCell style={{ width: '11%' }}>
                <Amount value={order.turnover} precision={8} />
              </BaseCell>
              <NumberCell style={{ width: '11%' }}>{order.maker}</NumberCell>
              <NumberCell style={{ width: '11%' }}>
                {order.makerOrderId.toString()}
              </NumberCell>
              <NumberCell style={{ width: '11%' }}>{order.taker}</NumberCell>
              <NumberCell style={{ width: '11%' }}>
                {order.takerOrderId.toString()}
              </NumberCell>
              <TimeCell style={{ width: '12%' }}>
                <div>
                  <span className={order.direction} />
                  <span className="time">
                    {moment(order['blockTime']).format('YYYY/MM/DD HH:mm')}
                  </span>
                </div>
              </TimeCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
