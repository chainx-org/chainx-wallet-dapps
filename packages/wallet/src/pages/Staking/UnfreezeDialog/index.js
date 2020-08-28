import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { useDispatch, useSelector } from 'react-redux'
import { headSelector } from '../../../reducers/chainSlice'
import { retry, toPrecision } from '../../../utils'
import { blockDuration, timeFormat } from '../../../utils/constants'
import moment from 'moment'
import { PrimaryButton } from '@chainx/ui'
import { isDemoSelector } from '../../../selectors'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'
import $t from '../../../locale'
import { unFreezeOpenSelector } from '../../../reducers/runStatusSlice'
import {
  fetchChainx2NativeAssetInfo,
  pcxPrecisionSelector
} from '@reducers/assetSlice'
import { unFreezeDataSelector } from '@reducers/runStatusSlice'
import { fetchAccountNominations } from '@reducers/validatorSlice'

export default function({ handleClose }) {
  const { account: target, revocations = [] } =
    useSelector(unFreezeDataSelector) || {}
  const unFreezeOpen = useSelector(unFreezeOpenSelector)
  const precision = useSelector(pcxPrecisionSelector)
  const nowBlockNumber = useSelector(headSelector)
  const nowBlockTime = moment.now()
  const isDemoAddr = useSelector(isDemoSelector)
  const accountAddress = useSelector(addressSelector)
  const dispatch = useDispatch()

  const [disableIndex, setDisableIndex] = useState(null)

  const unfreeze = async index => {
    setDisableIndex(index)

    try {
      const status = await signAndSendExtrinsic(accountAddress, {
        section: 'xStaking',
        method: 'unlock_unbonded_withdrawal',
        params: [target, index]
      })

      const messages = {
        successTitle: '解冻成功',
        failTitle: '解冻失败',
        successMessage: ``,
        failMessage: ``
      }

      await showSnack(status, messages, dispatch)
      handleClose()
      await retry(
        () => {
          dispatch(fetchAccountNominations(accountAddress))
          dispatch(fetchChainx2NativeAssetInfo(accountAddress))
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
            {revocations.map((revocation, index) => {
              const { lockedUntil: blockNumber } = revocation
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
