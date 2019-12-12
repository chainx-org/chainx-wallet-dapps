import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchWithdrawals,
  withdrawalsSelector
} from '../../reducers/trustSlice'
import Card from '../../components/Card'
import Empty from '../../components/Empty'
import Status from './Status'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@chainx/ui'
import { getChainx } from '../../services/chainx'
import Address from '../../components/Address'
import BtcAddress from '../AssetManagement/Records/components/BtcAddress'
import {
  AmountCell,
  BaseCell,
  HeadCell,
  IndexCell,
  RightAlignCell,
  StatusHeadCell
} from './Wrapper'
import { xbtcPrecisionSelector } from '../selectors/assets'
import { reverseHex, toPrecision } from '../../utils'
import BtcTx from '../AssetManagement/Records/components/BtcTx'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const EmptyWrapper = styled.div`
  width: 100%;
  margin-top: 80px;
  margin-bottom: 80px;
  flex-direction: column;
`

export default function() {
  const dispatch = useDispatch()
  const withdrawals = useSelector(withdrawalsSelector)
  const chainx = getChainx()
  const precision = useSelector(xbtcPrecisionSelector)

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
                <HeadCell>申请时间</HeadCell>
                <HeadCell>编号</HeadCell>
                <HeadCell>资产</HeadCell>
                <HeadCell>金额</HeadCell>
                <HeadCell>账户地址</HeadCell>
                <HeadCell>原链地址</HeadCell>
                <HeadCell>交易哈希</HeadCell>
                <StatusHeadCell>状态</StatusHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawals.map(data => {
                const address = chainx.account.encodeAddress(data.accountid)

                return (
                  <TableRow key={data.id}>
                    <TableCell>{data.height}</TableCell>
                    <IndexCell>{data.id}</IndexCell>
                    <BaseCell>{data.token}</BaseCell>
                    <AmountCell>
                      {toPrecision(data.balance, precision)}
                    </AmountCell>
                    <TableCell>
                      <Address address={address} />
                    </TableCell>
                    <TableCell>
                      <BtcAddress address={data.address} />
                    </TableCell>
                    <TableCell>
                      {data.txid ? (
                        <BtcTx hash={reverseHex(data.txid)} />
                      ) : null}
                    </TableCell>
                    <RightAlignCell>
                      <Status status={data.status} />
                    </RightAlignCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {withdrawals.length ? null : (
            <EmptyWrapper>
              <Empty text="暂无提现记录" />
            </EmptyWrapper>
          )}
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
