import React from 'react'
import signerIcon from '../signer.svg'
import $t from '../../../../locale'
import signerDownloadIcon from './signer_download.svg'
import { useDispatch } from 'react-redux'
import { setOpenSignerDownloadDialog } from '../../../../reducers/runStatusSlice'
import Wrapper from './Wrapper'
import { connectSigner } from '../../../../services/signer'

export default function() {
  const dispatch = useDispatch()

  return (
    <Wrapper>
      <span onClick={connectSigner}>
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
