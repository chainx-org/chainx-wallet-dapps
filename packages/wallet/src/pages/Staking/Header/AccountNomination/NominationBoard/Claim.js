import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { PrimaryButton } from '@chainx/ui'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import {
  fetchIntentions,
  fetchNominationRecords
} from '../../../../../reducers/intentionSlice'
import { fetchAccountAssets } from '../../../../../reducers/assetSlice'
import { isDemoSelector } from '../../../../../selectors'
import $t from '../../../../../locale'
import { canRequestSign, retry } from '../../../../../utils'
import { getChainx } from '../../../../../services/chainx'
import { useIsMounted } from '../../../../../utils/hooks'

export default function({ record, interest }) {
  const { account } = record.intention || {}
  const isDemoAddr = useSelector(isDemoSelector)

  const accountAddress = useSelector(addressSelector)
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch()
  const chainx = getChainx()

  const mounted = useIsMounted()

  const claim = async target => {
    if (!canRequestSign()) {
      return
    }

    setDisabled(true)
    try {
      const extrinsic = chainx.stake.voteClaim(target)
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )

      const hashMsg = $t('COMMON_TX_HASH', { hash: status.txHash })
      const messages = {
        successTitle: $t('COMMON_MSG_SUCCESS', { msg: $t('STAKING_CLAIM') }),
        failTitle: $t('COMMON_MSG_Fail', { msg: $t('STAKING_CLAIM') }),
        successMessage: hashMsg,
        failMessage: hashMsg
      }

      await showSnack(status, messages, dispatch)
      retry(
        () => {
          Promise.all([
            dispatch(fetchNominationRecords(accountAddress)),
            dispatch(fetchAccountAssets(accountAddress)),
            dispatch(fetchIntentions())
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
      onClick={() => claim(account)}
    >
      {$t('STAKING_CLAIM')}
    </PrimaryButton>
  )
}
