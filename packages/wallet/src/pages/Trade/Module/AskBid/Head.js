import { Table, TableHead, TableRow } from '@chainx/ui'
import React from 'react'
import HeadCell from '../components/HeadCell'

export default function() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeadCell style={{ width: '30%' }}>价格</HeadCell>
          <HeadCell style={{ width: '30%' }}>数量 (PCX)</HeadCell>
          <HeadCell style={{ textAlign: 'right', width: '40%' }}>
            累计 (PCX)
          </HeadCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}
