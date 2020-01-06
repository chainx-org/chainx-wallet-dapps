import React, { useEffect } from 'react'
import { Wrapper } from './Wrapper'
import Card from '../../components/Card'
import $t from '../../locale'
import { BaseCell, HeadCell } from './Wrapper'
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TablePagination
} from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import { accountIdSelector } from '../selectors/assets'
import {
  fetchHistoryTxs,
  historyPageSelector,
  historyPageSizeSelector,
  historyTotalSelector,
  historyTxsSelector
} from '../../reducers/historyTxSlice'
import moment from 'moment'
import { timeFormat } from '../../utils/constants'
import Hash from '../../components/Hash'
import { ensure0xPrefix } from '../../utils'
import { localeSelector } from '../../reducers/settingsSlice'
import { enCallNameMap, zhCallNameMap } from './callNameMap'
import getDetailedArgs from './detailedArgs'

function getOperation(module, call, locale) {
  const callNameMap = locale === 'zh' ? zhCallNameMap : enCallNameMap

  return callNameMap[call] || `${module}|${call}`
}

export default function() {
  const dispatch = useDispatch()
  const accountId = useSelector(accountIdSelector)
  const locale = useSelector(localeSelector)

  const page = useSelector(historyPageSelector)
  const pageSize = useSelector(historyPageSizeSelector)
  const total = useSelector(historyTotalSelector)

  const txs = useSelector(historyTxsSelector)
  console.log('txs', txs)

  useEffect(() => {
    dispatch(fetchHistoryTxs(accountId, 0))
  }, [dispatch, accountId])

  const fetchTxs = p => {
    dispatch(fetchHistoryTxs(accountId, p))
  }

  return (
    <Wrapper>
      <Card>
        <div>{$t('TXS_HISTORY_LIST')}</div>
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
                <HeadCell>{$t('TXS_TIME')}</HeadCell>
                <HeadCell>{$t('TXS_ID')}</HeadCell>
                <HeadCell>{$t('TXS_OPERATION')}</HeadCell>
                <HeadCell style={{ textAlign: 'right' }}>
                  {$t('TXS_PARAMS')}
                </HeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {txs.map(tx => {
                const time = tx.time ? moment(tx.time).format(timeFormat) : null

                return (
                  <TableRow key={tx.hash}>
                    <BaseCell>{time}</BaseCell>
                    <TableCell>
                      <Hash hash={ensure0xPrefix(tx.hash)} />
                    </TableCell>
                    <BaseCell>
                      {getOperation(tx.module, tx.call, locale)}
                    </BaseCell>
                    <BaseCell style={{ textAlign: 'right' }}>
                      {getDetailedArgs(tx).reduce((result, item, index) => {
                        return (
                          result +
                          `${index <= 0 ? '' : ','}${item.label}: ${item.value}`
                        )
                      }, '')}
                    </BaseCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {txs.length > 0 ? (
            <TablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              onChange={p => {
                fetchTxs(p)
              }}
            />
          ) : null}
        </div>
      </Card>
    </Wrapper>
  )
}
