import { Table, TableBody, TableRow } from '@chainx/ui'
import { toPrecision } from '../../../../../utils'
import moment from 'moment'
import { PriceAriseCell, PriceDownCell } from '../../components/PriceCell'
import AmountCell from '../../components/AmountCell'
import TimeCell from './TimeCell'
import React from 'react'
import { useSelector } from 'react-redux'
import { currentPairSelector } from '../../../../../reducers/dexSlice'
import {
  currentPairAssetInfo,
  normalizedCurrentFillsSelector
} from '../../selectors'
import styled from 'styled-components'
import { timeFormat } from '../../../../../utils/constants'

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
            const { pipDecimals, tickDecimals } = pair || {
              pipDecimals: 0,
              tickDecimals: 0
            }
            const price = Number(toPrecision(fill.price, pipDecimals)).toFixed(
              pipDecimals - tickDecimals
            )
            const assetDecimals = asset && asset.info ? asset.info.decimals : 0
            const m = moment(fill['block.time'])
            const time = m.format('HH:mm:ss')
            const fullTime = m.format(timeFormat)
            const amount = Number(toPrecision(fill.turnover, assetDecimals))

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
                  value={amount}
                  precision={asset && asset.precision}
                  style={{ width: '42%' }}
                />
                <TimeCell style={{ width: '28%' }} title={fullTime}>
                  {time}
                </TimeCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Wrapper>
  )
}
