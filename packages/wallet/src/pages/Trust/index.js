import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWithdrawals } from '../../reducers/trustSlice'
import { withdrawalsSelector } from '../../reducers/trustSlice'
import AssetView from '../AssetManagement/Assets/components/AssetView'
import Card from '../../components/Card'

import { Table, TableBody, TableCell, TableHead, TableRow } from '@chainx/ui'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export default function() {
  const dispatch = useDispatch()
  const withdrawals = useSelector(withdrawalsSelector)

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
                <TableCell>申请时间</TableCell>
                <TableCell>编号</TableCell>
                <TableCell>资产</TableCell>
                <TableCell>金额</TableCell>
                <TableCell>账户地址</TableCell>
                <TableCell>原链地址</TableCell>
                <TableCell>交易哈希</TableCell>
                <TableCell>状态</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawals.map(data => (
                <TableRow key={data.id}>
                  <TableCell>{data.height}</TableCell>
                  <TableCell>{data.id}</TableCell>
                  <TableCell>X-BTC</TableCell>
                  <TableCell>
                    <AssetView value={data.balance} precision={8} />
                  </TableCell>
                  <TableCell>{data.accountid}</TableCell>
                  <TableCell>{data.address}</TableCell>
                  <TableCell>{data.txid}</TableCell>
                  <TableCell>{}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* <TablePagination
            page={currentPage}
            pageSize={10}
            total={121}
            onChange={a => {
              console.log(a)
              setPage(a)
            }}
          ></TablePagination> */}
        </div>
      </Card>
    </Wrapper>
  )
}
