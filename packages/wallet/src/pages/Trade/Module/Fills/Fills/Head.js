import React from 'react'
import { Table, TableHead, TableRow } from '@chainx/ui'
import HeadCell from '../../components/HeadCell'

export default function() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeadCell style={{ width: '30%' }}>价格</HeadCell>
          <HeadCell style={{ width: '42%' }}>数量</HeadCell>
          <HeadCell style={{ textAlign: 'right', width: '28%' }}>时间</HeadCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}
