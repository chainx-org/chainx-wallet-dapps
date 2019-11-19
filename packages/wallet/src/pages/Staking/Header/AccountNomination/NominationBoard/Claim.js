import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { PrimaryButton } from '@chainx/ui'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import { fetchNominationRecords } from '../../../../../reducers/intentionSlice'
import { fetchAccountAssets } from '../../../../../reducers/assetSlice'

export default function({ record, interest }) {
  const { account } = record.intention || {}

  const accountAddress = useSelector(addressSelector)
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch()

  const claim = async target => {
    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    setDisabled(true)
    try {
      const status = await signAndSendExtrinsic(
        accountAddress,
        'xStaking',
        'claim',
        [target]
      )
      const messages = {
        successTitle: '提息成功',
        failTitle: '提息失败',
        successMessage: `交易hash ${status.txHash}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      dispatch(fetchNominationRecords(accountAddress))
      dispatch(fetchAccountAssets(accountAddress))
    } catch (e) {
      console.log(e)
      debugger
    } finally {
      setDisabled(false)
    }
  }

  return (
    <PrimaryButton
      disabled={interest <= 0 || disabled}
      size="small"
      style={{ marginRight: 8 }}
      onClick={() => claim(account)}
    >
      提息
    </PrimaryButton>
  )
}
