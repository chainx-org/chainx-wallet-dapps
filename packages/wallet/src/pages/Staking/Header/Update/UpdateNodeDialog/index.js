import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { noneFunc } from '../../../../../utils'
import { useSelector } from 'react-redux'
import { myIntentionSelector } from './selectors'
import { getChainx } from '../../../../../services/chainx'
import { Label, Value } from '../../../../AssetManagement/components'
import { PrimaryButton, TextInput } from '@chainx/ui'
import $t from '../../../../../locale'
import { checkTextLengthAndHasError } from '../../../../../utils/errorCheck'
import { addressSelector } from '../../../../../reducers/addressSlice'

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

  const [disabled, setDisabled] = useState(true)

  const accountAddress = useSelector(addressSelector)
  console.log(accountAddress)

  const refresh = async () => {
    if (checkTextLengthAndHasError(url, 24, setUrlErrMsg)) {
      return
    }

    if (checkTextLengthAndHasError(about, 256, setAboutErrMsg)) {
      return
    }

    setDisabled(true)
    // await signAndSendExtrinsic(accountAddress, 'xStaking', 'refresh', [])
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
            placeholder="24字符以内"
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
