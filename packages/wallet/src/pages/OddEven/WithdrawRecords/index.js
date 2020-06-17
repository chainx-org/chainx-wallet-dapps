import React from 'react'
import styled from 'styled-components'
import $t from '../../../locale'
import { Table, TableHead, TableRow, TableBody } from '@chainx/ui'
import {
  AmountCell,
  BaseCell,
  RightAlignCell,
  StatusHeadCell
} from '../../Trust/Wrapper'
import Empty from '../../../components/Empty'
import { useSelector } from 'react-redux'
import { oddEvenWithdrawRecordsSelector } from '../../../reducers/oddevenSlice'
import moment from 'moment'
import { timeFormat } from '../../../utils/constants'
import Address from '../../../components/Address'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { toPrecision } from '../../../utils'

const Wrapper = styled.div`
  position: absolute;
  top: 56px;
  right: 16px;

  background: #ffffff;
  border: 1px solid #dce0e2;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 10px;

  display: flex;
  flex-direction: column;
`

const Title = styled.h3`
  opacity: 0.72;
  font-weight: 600;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.12px;
  line-height: 20px;

  padding: 10px 15px;
  margin: 0;
`

export const HeadCell = styled(BaseCell)`
  font-weight: 600 !important;
`

const EmptyWrapper = styled.div`
  width: 100%;
  margin-top: 80px;
  margin-bottom: 80px;
  flex-direction: column;
`

const StatusWrapper = styled.span`
  opacity: 0.72;
  font-weight: 600;
  font-size: 12px;
  color: #000000;
  letter-spacing: 0.2px;
  text-align: right;
  line-height: 16px;
`

function Status({ status }) {
  return <StatusWrapper>{status === 0 ? '提现中' : '已处理'}</StatusWrapper>
}

export default function() {
  const withdrawals = useSelector(oddEvenWithdrawRecordsSelector)
  const precision = useSelector(pcxPrecisionSelector)

  console.log(withdrawals)

  return (
    <Wrapper>
      <Title>{$t('PREDICT_WITHDRAW_RECORDS')}</Title>
      <Table>
        <TableHead>
          <TableRow>
            <HeadCell style={{ width: 171 }}>{$t('TRUST_TIME')}</HeadCell>
            <HeadCell style={{ width: 148 }}>
              {$t('PREDICT_WITHDRAW_MAINNET_ADDR')}
            </HeadCell>
            <HeadCell style={{ width: 136 }}>{$t('TRUST_AMOUNT')}</HeadCell>
            <StatusHeadCell style={{ width: 84 }}>
              {$t('PREDICT_STATUS')}
            </StatusHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {withdrawals.map(data => {
            const time = data.start_time
              ? moment(data.start_time * 1000).format(timeFormat)
              : null

            return (
              <TableRow key={data.index}>
                <BaseCell>{time}</BaseCell>
                <BaseCell>
                  <Address address={data.dest_account} mainnet={true} />
                </BaseCell>
                <AmountCell>
                  {toPrecision(data.withdraw_balance, precision)} PCX
                </AmountCell>
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
    </Wrapper>
  )
}
