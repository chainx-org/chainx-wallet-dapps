import React, { useEffect } from 'react'
import { Table, TableBody, TableHead, TableRow } from '@chainx/ui'
import HeadCell from '../../components/HeadCell'
import { useDispatch, useSelector } from 'react-redux'
import {
  currentPairSelector,
  fetchFills
} from '../../../../../reducers/tradeSlice'
import { PriceAriseCell, PriceDownCell } from '../../components/PriceCell'
import { toPrecision } from '../../../../../utils'
import AmountCell from '../../components/AmountCell'
import moment from 'moment'
import TimeCell from './TimeCell'
import { Empty } from '../../../../../components'
import TitledCard from '../../../components/TitledCard'
import {
  currentPairAssetInfo,
  normalizedCurrentFillsSelector
} from '../../selectors'

export default function() {
  const pair = useSelector(currentPairSelector)
  const fills = useSelector(normalizedCurrentFillsSelector)
  const asset = useSelector(currentPairAssetInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    if (pair) {
      dispatch(fetchFills(pair.id))
    }
  }, [dispatch, pair])

  return (
    <TitledCard style={{ marginTop: 16 }}>
      <header>Latest</header>
      <Table>
        <TableHead>
          <TableRow>
            <HeadCell>价格</HeadCell>
            <HeadCell>数量</HeadCell>
            <HeadCell style={{ textAlign: 'right' }}>时间</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fills.map((fill, index) => {
            const { precision, unitPrecision } = pair || {
              precision: 0,
              unitPrecision: 0
            }
            const price = Number(
              toPrecision(fill.price, pair.precision)
            ).toFixed(precision - unitPrecision)
            const time = moment(fill['block.time']).format('HH:mm:ss')

            return (
              <TableRow key={index}>
                {fill.arise ? (
                  <PriceAriseCell style={{ fontSize: 12, width: '22%' }}>
                    {price}
                  </PriceAriseCell>
                ) : (
                  <PriceDownCell style={{ fontSize: 12, width: '22%' }}>
                    {price}
                  </PriceDownCell>
                )}
                <AmountCell
                  value={fill.amount}
                  precision={asset && asset.precision}
                  style={{ width: '50%' }}
                />
                <TimeCell style={{ width: '28%' }}>{time}</TimeCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {fills.length <= 0 && <Empty text={'无成交'} style={{ marginTop: 30 }} />}
    </TitledCard>
  )
}
