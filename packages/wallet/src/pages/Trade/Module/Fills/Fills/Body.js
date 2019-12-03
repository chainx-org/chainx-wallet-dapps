import { Table, TableBody, TableRow } from '@chainx/ui'
import { toPrecision } from '../../../../../utils'
import moment from 'moment'
import { PriceAriseCell, PriceDownCell } from '../../components/PriceCell'
import AmountCell from '../../components/AmountCell'
import TimeCell from './TimeCell'
import React from 'react'
import { useSelector } from 'react-redux'
import { currentPairSelector } from '../../../../../reducers/tradeSlice'
import {
  currentPairAssetInfo,
  normalizedCurrentFillsSelector
} from '../../selectors'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 360px;
  overflow-y: auto;
`

export default function() {
  const pair = useSelector(currentPairSelector)
  const fills = useSelector(normalizedCurrentFillsSelector)
  const asset = useSelector(currentPairAssetInfo)

  return (
    <Wrapper>
      <Table>
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
                  <PriceAriseCell style={{ fontSize: 12, width: '30%' }}>
                    {price}
                  </PriceAriseCell>
                ) : (
                  <PriceDownCell style={{ fontSize: 12, width: '30%' }}>
                    {price}
                  </PriceDownCell>
                )}
                <AmountCell
                  value={fill.amount}
                  precision={asset && asset.precision}
                  style={{ width: '42%' }}
                />
                <TimeCell style={{ width: '28%' }}>{time}</TimeCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Wrapper>
  )
}
