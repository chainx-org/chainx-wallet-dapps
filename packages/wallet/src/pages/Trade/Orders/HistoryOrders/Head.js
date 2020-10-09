import React from 'react'
import { Table, TableHead, TableRow } from '@chainx/ui'
import { HeadCell } from '../Wrapper'
import $t from '../../../../locale'

export default function() {
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
    </Table>
  )
}
