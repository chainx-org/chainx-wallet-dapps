import React from 'react'
import { Table, TableHead, TableRow } from '@chainx/ui'
import HeadCell from '../../components/HeadCell'
import $t from '../../../../../locale'

export default function() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeadCell style={{ width: '30%' }}>{$t('TRADE_PRICE')}</HeadCell>
          <HeadCell style={{ width: '42%' }}>{$t('TRADE_AMOUNT')}</HeadCell>
          <HeadCell style={{ textAlign: 'right', width: '28%' }}>
            {$t('TRADE_DATE')}
          </HeadCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}
