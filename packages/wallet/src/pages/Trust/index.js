import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { withdrawalsSelector } from '../../reducers/trustSlice'
import Card from '../../components/Card'
import Empty from '../../components/Empty'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@chainx/ui'
import Address from '../../components/Address'
import BtcAddress from '../AssetManagement/Records/components/BtcAddress'
import {
  AmountCell,
  BaseCell,
  HeadCell,
  IndexCell,
  StatusHeadCell
} from './Wrapper'
import { toPrecision } from '../../utils'
import $t from '../../locale'
import { fetchWithdrawalList } from '@reducers/trustSlice'
import { assetsInfoSelector, xbtcPrecisionSelector } from '@reducers/assetSlice'

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
  // const chainx = getChainx()
  const precision = useSelector(xbtcPrecisionSelector)
  const assetsInfo = useSelector(assetsInfoSelector)

  useEffect(() => {
    dispatch(fetchWithdrawalList())
  }, [dispatch])

  return (
    <Wrapper>
      <Card>
        <div>{$t('TRUST_WITHDRAWAL_LIST')}</div>
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
                <HeadCell>{$t('TRUST_TIME')}</HeadCell>
                <HeadCell>{$t('TRUST_INDEX')}</HeadCell>
                <HeadCell>{$t('TRUST_ASSETS')}</HeadCell>
                <HeadCell>{$t('TRUST_AMOUNT')}</HeadCell>
                <HeadCell>{$t('TRUST_ACCOUNT_ADDR')}</HeadCell>
                <HeadCell>{$t('TRUST_ORIGINAL_CHAIN')}</HeadCell>
                <HeadCell>{$t('COMMON_MEMO_SHORT')}</HeadCell>
                <HeadCell>{$t('TRUST_TX_HASH')}</HeadCell>
                <StatusHeadCell>{$t('TRUST_STATUS')}</StatusHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawals.map((data, idx) => {
                const {
                  height,
                  index,
                  applicant,
                  addr,
                  assetId,
                  balance,
                  ext
                } = data
                const token = assetsInfo.find(
                  a => String(a.id) === String(assetId)
                )?.info?.token

                return (
                  <TableRow key={idx}>
                    <BaseCell>{height}</BaseCell>
                    <IndexCell>{index}</IndexCell>
                    <BaseCell>{token}</BaseCell>
                    <AmountCell>{toPrecision(balance, precision)}</AmountCell>
                    <TableCell>
                      <Address address={applicant} />
                    </TableCell>
                    <TableCell>
                      <BtcAddress address={addr} />
                    </TableCell>
                    <TableCell>{ext}</TableCell>
                    {/*<TableCell>*/}
                    {/*  {data.txid ? (*/}
                    {/*    <BtcTx hash={reverseHex(data.txid)} />*/}
                    {/*  ) : null}*/}
                    {/*</TableCell>*/}
                    {/*<RightAlignCell>*/}
                    {/*  <Status status={data.status} />*/}
                    {/*</RightAlignCell>*/}
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
        </div>
      </Card>
    </Wrapper>
  )
}
