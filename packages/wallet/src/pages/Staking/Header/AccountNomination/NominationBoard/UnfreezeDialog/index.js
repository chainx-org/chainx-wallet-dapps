import React from 'react'
import StyledDialog from './StyledDialog'
import { useSelector } from 'react-redux'
import {
  blockNumberSelector,
  headSelector
} from '../../../../../../reducers/chainSlice'
import { pcxPrecisionSelector } from '../../../../../selectors/assets'
import { toPrecision } from '../../../../../../utils'
import { blockDuration, timeFormat } from '../../../../../../utils/constants'
import moment from 'moment'
import { PrimaryButton } from '@chainx/ui'
import { isDemoSelector } from '../../../../../../selectors'

export default function({ handleClose, revocations = [] }) {
  const nowBlockNumber = useSelector(blockNumberSelector)
  const precision = useSelector(pcxPrecisionSelector)
  const head = useSelector(headSelector)
  const { now = 0 } = head || {}
  const nowBlockTime = now * 1000
  const isDemoAddr = useSelector(isDemoSelector)

  return (
    <StyledDialog open title={'赎回解冻'} handleClose={handleClose}>
      <div className="wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ paddingLeft: 16 }}>到期时间（预估）</th>
              <th>冻结金额</th>
            </tr>
          </thead>
          <tbody>
            {revocations.map((revocation, index) => {
              const { blockNumber } = revocation
              return (
                <tr key={index}>
                  <td style={{ paddingLeft: 16 }}>
                    <p
                      style={{
                        opacity: 0.72,
                        fontWeight: nowBlockNumber >= blockNumber ? 600 : 400
                      }}
                    >
                      {nowBlockNumber >= blockNumber
                        ? '已到期'
                        : moment(
                            nowBlockTime +
                              (blockNumber - nowBlockNumber) * blockDuration
                          ).format(timeFormat)}
                    </p>
                    <p style={{ opacity: 0.32 }}>块高 {blockNumber}</p>
                  </td>
                  <td style={{ fontWeight: 600, opacity: 0.72 }}>
                    {toPrecision(revocation.value, precision)}
                  </td>
                  <td>
                    <PrimaryButton
                      disabled={isDemoAddr || nowBlockNumber < blockNumber}
                      size="small"
                    >
                      解冻
                    </PrimaryButton>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </StyledDialog>
  )
}
