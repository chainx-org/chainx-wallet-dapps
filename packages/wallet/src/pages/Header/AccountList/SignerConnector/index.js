import React from 'react'
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

export default function() {
  const dispatch = useDispatch()
  const isExtensionAccount = useSelector(isExtensionSelector)

  const connect = async () => {
    try {
      if (isExtensionAccount) {
        disConnectExtension()
      }

      await connectSigner()
    } catch (e) {
      if (isExtensionAccount) {
        listenExtension()
      }

      addAutoCloseSnackWithParams(
        store.dispatch,
        typeEnum.ERROR,
        $t('HEADER_MSG_SIGNER_LINK_FAIL_TITLE'),
        $t('HEADER_MSG_SIGNER_LINK_FAIL_DETAIL')
      )
    }
  }

  return (
    <Wrapper>
      <span onClick={connect}>
        <img src={signerIcon} alt="extension" />
        <span>{$t('HEADER_CONNECT_SIGNER')}</span>
      </span>
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
