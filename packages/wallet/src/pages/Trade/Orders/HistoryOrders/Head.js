import React from 'react'
import { Table, TableHead, TableRow } from '@chainx/ui'
import { HeadCell } from '../Wrapper'
import $t from '../../../../locale'

export default function() {
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
            {$t('TRADE_ORDER_PRICE')}
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
    </Table>
  )
}
