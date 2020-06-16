import React, { useEffect, useState } from 'react'
import StyledDialog from './StyledDialog'
import { noneFunc, retry } from '../../../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { myIntentionSelector } from './selectors'
import { getChainx } from '../../../../../services/chainx'
import { Label, Value } from './StyledDialog'
import { PrimaryButton, TextInput, Switch } from '@chainx/ui'
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
import ErrorText from '../../../../../components/ErrorText'

export default function({ handleClose = noneFunc }) {
  const intention = useSelector(myIntentionSelector)
  const {
    sessionKey,
    isActive,
    url: intentionUrl,
    about: intentionAbout
  } = intention

  const [wantToRun, setWantToRun] = useState(!!isActive)
  const [wantToRunErrMsg, setWantToRunErrMsg] = useState('')

  const chainx = getChainx()
  const sessionAddress = chainx.account.encodeAddress(sessionKey)

  const [key, setKey] = useState(sessionAddress)
  const [keyErrMsg, setKeyErrMsg] = useState('')

  const [url, setUrl] = useState(intentionUrl)
  const [urlErrMsg, setUrlErrMsg] = useState('')

  const [about, setAbout] = useState(intentionAbout)
  const [aboutErrMsg, setAboutErrMsg] = useState('')

  const [disabled, setDisabled] = useState(false)

  const accountAddress = useSelector(addressSelector)
  const dispatch = useDispatch()

  const [minimumSelfVote, setMinimumSelfVote] = useState(0)
  const [minimumAllVote, setMinimumAllVote] = useState(0)

  useEffect(() => {
    const chainx = getChainx()
    chainx.api.query.xStaking.minimumCandidateThreshold().then(data => {
      setMinimumSelfVote(data[0].toNumber())
      setMinimumAllVote(data[1].toNumber())
    })
  }, [])

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

    if (wantToRun && intention.selfVote < minimumSelfVote) {
      return setWantToRunErrMsg(
        $t('STAKING_MINIMUM_SELF_VOTE', { amount: minimumSelfVote })
      )
    }

    if (wantToRun && intention.totalNomination < minimumAllVote) {
      return setWantToRunErrMsg(
        $t('STAKING_MINIMUM_NOMINATION', { amount: minimumAllVote })
      )
    }

    setDisabled(true)
    try {
      const extrinsic = chainx.stake.refresh(url, wantToRun, key, about)
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )
      const messages = {
        successTitle: '更新成功',
        failTitle: '更新失败',
        successMessage: `交易hash ${status.txHash}`,
        failMessage: `交易hash ${status.txHash}`
      }
      setDisabled(false)
      await showSnack(status, messages, dispatch)
      handleClose()
      await retry(
        () => {
          dispatch(fetchIntentions())
        },
        5,
        2
      )
    } catch (e) {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog
      open
      title={$t('STAKING_UPDATE_INTENTION')}
      handleClose={handleClose}
    >
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
            showClear={false}
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
            showClear={false}
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
            placeholder="简介（128 字符以内）"
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

        <div className="run">
          <div className="status">
            <Label>参选状态：</Label>
            <Value>{wantToRun ? '参选' : '退选'}</Value>
          </div>

          <Switch
            checked={wantToRun}
            onChange={checked => setWantToRun(checked)}
          />
        </div>
        {wantToRunErrMsg && <ErrorText>{wantToRunErrMsg}</ErrorText>}

        <div className="confirm">
          <PrimaryButton disabled={disabled} size="fullWidth" onClick={refresh}>
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </div>
    </StyledDialog>
  )
}
