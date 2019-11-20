import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { noneFunc } from '../../../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { myIntentionSelector } from './selectors'
import { getChainx } from '../../../../../services/chainx'
import { Label, Value } from '../../../../AssetManagement/components'
import { PrimaryButton, TextInput } from '@chainx/ui'
import $t from '../../../../../locale'
import {
  checkTextLengthAndHasError,
  checkTextShortAndHasError
} from '../../../../../utils/errorCheck'
import { addressSelector } from '../../../../../reducers/addressSlice'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import { fetchIntentions } from '../../../../../reducers/intentionSlice'

export default function({ handleClose = noneFunc }) {
  const intention = useSelector(myIntentionSelector)
  const { sessionKey } = intention

  const chainx = getChainx()
  const sessionAddress = chainx.account.encodeAddress(sessionKey)

  const [key, setKey] = useState('')
  const [keyErrMsg, setKeyErrMsg] = useState('')

  const [url, setUrl] = useState('')
  const [urlErrMsg, setUrlErrMsg] = useState('')

  const [about, setAbout] = useState('')
  const [aboutErrMsg, setAboutErrMsg] = useState('')

  const [disabled, setDisabled] = useState(false)

  const accountAddress = useSelector(addressSelector)
  const dispatch = useDispatch()

  const checkKeyAndHasError = () => {
    return !(
      chainx.account.isAddressValid(key) || /^(0x)?[\da-zA-Z]{64}$/.test(key)
    )
  }

  const refresh = async () => {
    if (checkKeyAndHasError()) {
      setKeyErrMsg($t('COMMON_INVALID_FORMAT'))
      return
    }

    if (
      checkTextLengthAndHasError(url, 24, setUrlErrMsg) ||
      checkTextShortAndHasError(url, 4, setUrlErrMsg)
    ) {
      return
    }

    if (checkTextLengthAndHasError(about, 256, setAboutErrMsg)) {
      return
    }

    setDisabled(true)
    try {
      const status = await signAndSendExtrinsic(
        accountAddress,
        'xStaking',
        'refresh',
        [url, undefined, key, about]
      )
      const messages = {
        successTitle: '更新成功',
        failTitle: '更新失败',
        successMessage: `交易hash ${status.txHash}`,
        failMessage: `交易hash ${status.txHash}`
      }
      await showSnack(status, messages, dispatch)
      handleClose()
      setTimeout(() => dispatch(fetchIntentions()), 2000)
    } catch (e) {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog open title="更新节点" handleClose={handleClose}>
      <div className="wrapper">
        <ul>
          <li>
            <Label>当前出块地址</Label>
            <Value>{sessionAddress}</Value>
          </li>
        </ul>
        <div className="session-key">
          <p>ChainX 出块公钥/出块地址</p>
          <TextInput
            value={key}
            onChange={value => {
              setKeyErrMsg('')
              setKey(value)
            }}
            error={!!keyErrMsg}
            errorText={keyErrMsg}
          />
        </div>
        <div className="domain">
          <p>官网域名</p>
          <TextInput
            placeholder="4 - 24字符以内"
            value={url}
            onChange={value => {
              setUrlErrMsg('')
              setUrl(value)
            }}
            error={!!urlErrMsg}
            errorText={urlErrMsg}
          />
        </div>

        <div className="about">
          <TextInput
            placeholder="简介（256 字符以内）"
            multiline={true}
            rows={3}
            value={about}
            onChange={value => {
              setAboutErrMsg('')
              setAbout(value)
            }}
            error={!!aboutErrMsg}
            errorText={aboutErrMsg}
          />
        </div>

        <div className="confirm">
          <PrimaryButton disabled={disabled} size="fullWidth" onClick={refresh}>
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </div>
    </StyledDialog>
  )
}
