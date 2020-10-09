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
          <HeadCell style={{ width: '10%' }}>{$t('TRADE_SIDE')}</HeadCell>
          <HeadCell style={{ width: '8%' }}>{$t('TRADE_PAIR')}</HeadCell>
          <HeadCell style={{ width: '11%' }}>
            {$t('TRADE_ORDER_PRICE')}
          </HeadCell>
          <HeadCell style={{ width: '13%' }}>
            {$t('TRADE_ORDER_AMOUNT')}
          </HeadCell>
          {/*<HeadCell style={{ width: '16%' }}>*/}
          {/*  {$t('TRADE_ORDER_FREEZE')}*/}
          {/*</HeadCell>*/}
          <HeadCell style={{ width: '16%' }}>
            {$t('TRADE_ORDER_FILLED_PERCENT')}
          </HeadCell>
          <HeadCell style={{ textAlign: 'right' }}>
            {$t('TRADE_OPERATION')}
          </HeadCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}
