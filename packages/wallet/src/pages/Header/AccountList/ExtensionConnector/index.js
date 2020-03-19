import { useDispatch, useSelector } from 'react-redux'
import Wrapper from './Wrapper'
import React from 'react'
import signerIcon from '../signer.svg'
import $t from '../../../../locale'
import extensionDownloadIcon from './extension_download.svg'
import { setOpenExtensionDownloadDialog } from '../../../../reducers/runStatusSlice'
import { connectExtension } from '../../../../connector'
import { signerConnectedSelector } from '../../../../reducers/addressSlice'
import { disconnectSigner } from '../../../../services/signer'

export default function() {
  const dispatch = useDispatch()
  const hasExtension = !!window.chainxProvider
  const signerConnected = useSelector(signerConnectedSelector)

  return (
    <Wrapper>
      <span
        onClick={async () => {
          if (!hasExtension) {
            dispatch(setOpenExtensionDownloadDialog(true))
          }

          try {
            await connectExtension()
          } catch (e) {
            console.log('Failed to connect extension')
          }

          if (signerConnected) {
            disconnectSigner()
          }
        }}
      >
        <img src={signerIcon} alt="extension" />
        <span>
          {$t(
            hasExtension ? 'HEADER_CONNECT_EXTENSION' : 'HEADER_GET_EXTENSION'
          )}
        </span>
      </span>
      <img
        src={extensionDownloadIcon}
        onClick={() => {
          dispatch(setOpenExtensionDownloadDialog(true))
        }}
        alt="download extension"
      />
    </Wrapper>
  )
}
