import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWithdrawals } from '../../reducers/trustSlice'
import { withdrawalsSelector } from '../../reducers/trustSlice'
import Card from '../../components/Card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@chainx/ui'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export default function() {
  const dispatch = useDispatch()
  const [currentPage, setPage] = useState(0)
  const withdrawals = useSelector(withdrawalsSelector)

  console.log(withdrawals)

  useEffect(() => {
    dispatch(fetchWithdrawals())
  }, [dispatch])

  return (
    <Wrapper>
      <Card>
        <div>提现列表</div>
        <div
          style={{
            marginTop: '16px',
            marginLeft: '-16px',
            marginRight: '-16px'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>我</TableCell>
                <TableCell>你</TableCell>
                <TableCell align="right">他</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>呵呵</TableCell>
                <TableCell>哈哈</TableCell>
                <TableCell align="right">哈哈</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>呵呵</TableCell>
                <TableCell>呵呵</TableCell>
                <TableCell align="right">呵呵</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>呵呵</TableCell>
                <TableCell>呵呵</TableCell>
                <TableCell align="right">呵呵</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>呵呵</TableCell>
                <TableCell>呵呵</TableCell>
                <TableCell align="right">呵呵</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <TablePagination
            page={currentPage}
            pageSize={10}
            total={121}
            onChange={a => {
              console.log(a)
              setPage(a)
            }}
          ></TablePagination>
        </div>
      </Card>
    </Wrapper>
  )
}
