import { Table, TableHead, TableRow } from '@chainx/ui'
import React from 'react'
import HeadCell from '../components/HeadCell'
import $t from '../../../../locale'

export default function() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeadCell style={{ width: '30%' }}>{$t('TRADE_PRICE')}</HeadCell>
          <HeadCell style={{ width: '30%' }}>{$t('TRADE_AMOUNT')}</HeadCell>
          <HeadCell style={{ textAlign: 'right', width: '40%' }}>
            {$t('TRADE_TOTAL')}
          </HeadCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}
