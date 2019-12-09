import React from 'react'
import { Table, TableHead, TableRow } from '@chainx/ui'
import { HeadCell } from './Wrapper'

export default function() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeadCell style={{ width: '12%' }}>时间</HeadCell>
          <HeadCell style={{ width: '5%' }}>编号</HeadCell>
          <HeadCell style={{ width: '8%' }}>交易对</HeadCell>
          <HeadCell style={{ width: '11%' }}>委托价格</HeadCell>
          <HeadCell style={{ width: '13%' }}>委托数量</HeadCell>
          <HeadCell style={{ width: '16%' }}>交易额</HeadCell>
          <HeadCell style={{ width: '16%' }}>实际成交/成交率%</HeadCell>
          <HeadCell style={{ textAlign: 'right' }}>操作</HeadCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}
