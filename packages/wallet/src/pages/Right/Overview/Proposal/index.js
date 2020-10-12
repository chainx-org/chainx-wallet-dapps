import React from 'react'
import { Table, TableHead, TableRow } from '@chainx/ui'
import { HeadCell } from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import { Empty } from '../../../../components'
import $t from '../../../../locale'
import { proposalsSelector } from '../../../../reducers/rightSlice'
import List from './Content'

export default function() {
  const orders = useSelector(proposalsSelector)
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <HeadCell style={{ width: '50%' }}>{$t('RIGHT_PROPOSAL')}</HeadCell>
            <HeadCell style={{ width: '25%' }}>
              {$t('RIGHT_PROPOSAL_PERSON')}
            </HeadCell>
            <HeadCell style={{ width: '25%' }}>
              {$t('RIGHT_PROPOSAL_LOCK')}
            </HeadCell>
          </TableRow>
        </TableHead>
        {orders.length > 0 && <List />}
      </Table>
      {orders.length === 0 && (
        <Empty
          text={$t('RIGHT_PROPOSAL_NONE')}
          style={{ marginTop: 30, marginBottom: 30 }}
        />
      )}
    </>
  )
}
