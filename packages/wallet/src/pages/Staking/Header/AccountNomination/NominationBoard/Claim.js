import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { PrimaryButton } from '@chainx/ui'
import {
  isExtrinsicSuccess,
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import { isDemoSelector } from '../../../../../selectors'
import $t from '../../../../../locale'
import { canRequestSign, retry, toPrecision } from '../../../../../utils'
import { useIsMounted } from '../../../../../utils/hooks'
import { pcxPrecisionSelector } from '@reducers/assetSlice'

export default function({ target, interest }) {
  const isDemoAddr = useSelector(isDemoSelector)

  const accountAddress = useSelector(addressSelector)
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch()
  const precision = useSelector(pcxPrecisionSelector)

  const mounted = useIsMounted()

  const claim = async () => {
    if (!canRequestSign()) {
      return
    }

    setDisabled(true)
    try {
      const status = await signAndSendExtrinsic(accountAddress, {
        section: 'xStaking',
        method: 'claim',
        params: [target]
      })

      const claimedMsg = do {
        if (!isExtrinsicSuccess(status)) {
          return null
        } else {
          const { data } = status.normalizedEvents.find(
            e => e.method === 'Claim'
          )

          $t('STAKING_CLAIM_AMOUNT', {
            amount: toPrecision(data[2], precision, false)
          })
        }
      }

      const hashMsg = $t('COMMON_TX_HASH', { hash: status.txHash })
      const messages = {
        successTitle: $t('COMMON_MSG_SUCCESS', { msg: $t('STAKING_CLAIM') }),
        failTitle: $t('COMMON_MSG_Fail', { msg: $t('STAKING_CLAIM') }),
        successMessage: claimedMsg,
        failMessage: hashMsg
      }

      await showSnack(status, messages, dispatch)
      retry(
        () => {
          Promise.all([
            // dispatch(fetchNominationRecords(accountAddress)),
            // dispatch(fetchAccountAssets(accountAddress)),
            // dispatch(fetchIntentions())
          ])
        },
        5,
        2
      ).then(() => console.log('Refresh stake info 5 times after claim'))
    } finally {
      if (mounted.current) {
        setDisabled(false)
      }
    }
  }

  return (
    <PrimaryButton
      disabled={isDemoAddr || interest <= 0 || disabled}
      size="small"
      style={{ marginRight: 8 }}
      onClick={() => claim()}
    >
      {$t('STAKING_CLAIM')}
    </PrimaryButton>
  )
}
