import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  accountSelector,
  isDemoSelector,
  signerConnectedSelector
} from '../../../reducers/addressSlice'
import useOutsideClick from '../../../utils/useClickOutside'
import { noneFunc } from '../../../utils'
import { networkSelector } from '../../../reducers/settingsSlice'
import {
  mainNetDemoAccount,
  testNetDemoAccount
} from '../../../utils/constants'
import Wrapper from './Wrapper'
import SignerConnector from './SignerConnector'
import {
  openExtensionDownloadDialogSelector,
  openSignerDownloadDialogSelector
} from '../../../reducers/runStatusSlice'
import { setDemoAccount, store } from '../../../index'
import $t from '@locale/index'

export default function({ close = noneFunc }) {
  const network = useSelector(networkSelector)
  const demoAccount =
    network === 'testnet'
      ? testNetDemoAccount.account
      : mainNetDemoAccount.account

  const demoAccountName = demoAccount.name

  const signerConnected = useSelector(signerConnectedSelector)
  const downloadSignerDialogOpen = useSelector(openSignerDownloadDialogSelector)
  const downloadExtensionDialogOpen = useSelector(
    openExtensionDownloadDialogSelector
  )

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    if (!downloadSignerDialogOpen && !downloadExtensionDialogOpen) {
      close()
    }
  })

  const account = useSelector(accountSelector) || {}
  const isDemo = useSelector(isDemoSelector)

  return (
    <Wrapper ref={popup}>
      <li onClick={() => setDemoAccount(store)}>
        <h4>{isDemo ? $t('HEADER_DEMO_ACCOUNT') : demoAccountName}</h4>
        <p>***</p>
      </li>
      {isDemo ? null : (
        <li>
          <h4>
            <span>{account && account.name}</span>
            {account.isFromExtension ? (
              <span className="extension">
                {$t('header_extension_account')}
              </span>
            ) : (
              <span className="extension">{$t('header_signer_account')}</span>
            )}
          </h4>
          <p>{account.address}</p>
        </li>
      )}
      {signerConnected ? null : <SignerConnector />}
      {/*{isExtensionAccount ? null : <ExtensionConnector />}*/}
    </Wrapper>
  )
}
