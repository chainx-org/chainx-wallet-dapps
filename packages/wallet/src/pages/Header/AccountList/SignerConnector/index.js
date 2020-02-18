import React, { useEffect, useRef, useState } from 'react'
import signerIcon from '../signer.svg'
import $t from '../../../../locale'
import signerDownloadIcon from './signer_download.svg'
import { useDispatch, useSelector } from 'react-redux'
import { setOpenSignerDownloadDialog } from '../../../../reducers/runStatusSlice'
import Wrapper from './Wrapper'
import { connectSigner } from '../../../../services/signer'
import {
  addAutoCloseSnackWithParams,
  typeEnum
} from '../../../../reducers/snackSlice'
import { store } from '../../../../index'
import { isExtensionSelector } from '../../../../reducers/addressSlice'
import { disConnectExtension, listenExtension } from '../../../../connector'
import { MiniLoading } from '../../../../components'
import { sleep } from '../../../../utils'

export default function() {
  const dispatch = useDispatch()
  const isExtensionAccount = useSelector(isExtensionSelector)

  const [connecting, setConnecting] = useState(false)

  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  const connect = async () => {
    try {
      if (isExtensionAccount) {
        disConnectExtension()
      }

      setConnecting(true)
      await Promise.race([connectSigner(), sleep(20)])
    } catch (e) {
      if (isExtensionAccount) {
        listenExtension()
      }

      addAutoCloseSnackWithParams(
        store.dispatch,
        typeEnum.ERROR,
        $t('HEADER_MSG_SIGNER_LINK_FAIL_TITLE'),
        $t(
          e && e.timeout
            ? 'HEADER_MSG_SIGNER_LINK_TIMEOUT'
            : 'HEADER_MSG_SIGNER_LINK_FAIL_DETAIL'
        )
      )
    } finally {
      if (mounted.current) {
        setConnecting(false)
      }
    }
  }

  return (
    <Wrapper>
      <span onClick={connect}>
        <img src={signerIcon} alt="extension" />
        <span>{$t('HEADER_CONNECT_SIGNER')}</span>
      </span>
      {connecting && <MiniLoading />}
      <img
        src={signerDownloadIcon}
        onClick={() => {
          dispatch(setOpenSignerDownloadDialog(true))
        }}
        alt="download signer"
      />
    </Wrapper>
  )
}
