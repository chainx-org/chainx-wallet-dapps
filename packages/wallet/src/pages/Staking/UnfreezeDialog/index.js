import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { useDispatch, useSelector } from 'react-redux'
import { blockNumberSelector, headSelector } from '../../../reducers/chainSlice'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { retry, toPrecision } from '../../../utils'
import { blockDuration, timeFormat } from '../../../utils/constants'
import moment from 'moment'
import { PrimaryButton } from '@chainx/ui'
import { isDemoSelector } from '../../../selectors'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { fetchNominationRecords } from '../../../reducers/intentionSlice'
import { fetchAccountAssets } from '../../../reducers/assetSlice'
import { addressSelector } from '../../../reducers/addressSlice'
import $t from '../../../locale'
import { getChainx } from '../../../services/chainx'
import { unFreezeOpenSelector } from '../../../reducers/runStatusSlice'

export default function({ handleClose, record }) {
  const unFreezeOpen = useSelector(unFreezeOpenSelector)
  const nowBlockNumber = useSelector(blockNumberSelector)
  const precision = useSelector(pcxPrecisionSelector)
  const head = useSelector(headSelector)
  const { now = 0 } = head || {}
  const nowBlockTime = now * 1000
  const isDemoAddr = useSelector(isDemoSelector)
  const intention = record && record.intention && record.intention.account
  const accountAddress = useSelector(addressSelector)
  const dispatch = useDispatch()

  const [disableIndex, setDisableIndex] = useState(null)
  const chainx = getChainx()

  const unfreeze = async index => {
    setDisableIndex(index)

    try {
      const extrinsic = chainx.stake.unfreeze(intention, index)
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )

      const messages = {
        successTitle: '解冻成功',
        failTitle: '解冻失败',
        successMessage: `交易hash ${status.txHash}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      handleClose()
      await retry(
        () => {
          dispatch(fetchNominationRecords(accountAddress))
          dispatch(fetchAccountAssets(accountAddress))
        },
        5,
        2
      )
    } finally {
      setDisableIndex(null)
    }
  }

  return (
    <StyledDialog
      open={unFreezeOpen}
      title={'赎回解冻'}
      handleClose={handleClose}
    >
      <div className="wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ paddingLeft: 16 }}>到期时间（预估）</th>
              <th>冻结金额</th>
            </tr>
          </thead>
          <tbody>
            {record &&
              record.info &&
              record.info.revocations.map((revocation, index) => {
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
                        disabled={
                          isDemoAddr ||
                          nowBlockNumber < blockNumber ||
                          disableIndex === index
                        }
                        size="small"
                        onClick={() => unfreeze(index)}
                      >
                        {$t('COMMON_UNFREEZE')}
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
