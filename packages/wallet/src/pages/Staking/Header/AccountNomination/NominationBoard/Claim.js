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
import { retry } from '../../../../../utils'
import { getChainx } from '../../../../../services/chainx'

export default function({ record, interest }) {
  const { account } = record.intention || {}
  const isDemoAddr = useSelector(isDemoSelector)

  const accountAddress = useSelector(addressSelector)
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch()
  const chainx = getChainx()

  const claim = async target => {
    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    setDisabled(true)
    try {
      const extrinsic = chainx.stake.voteClaim(target)
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )
      const messages = {
        successTitle: '提息成功',
        failTitle: '提息失败',
        successMessage: `交易hash ${status.txHash}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      await retry(
        () => {
          dispatch(fetchNominationRecords(accountAddress))
          dispatch(fetchAccountAssets(accountAddress))
          dispatch(fetchIntentions())
        },
        5,
        2
      )
    } finally {
      setDisabled(false)
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
