import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  accountSelector,
  isDemoSelector,
  isExtensionSelector,
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
import ExtensionConnector from './ExtensionConnector'
import { setDemoAccount, store } from '../../../index'
import $t from '../../../locale'

export default function({ close = noneFunc }) {
  const network = useSelector(networkSelector)
  const demoAccount =
    network === 'testnet'
      ? testNetDemoAccount.account
      : mainNetDemoAccount.account

  const demoAccountName = demoAccount.name

  const signerConnected = useSelector(signerConnectedSelector)
  const downloadSignerDialogOpen = useSelector(openSignerDownloadDialogSelector)
  const isExtensionAccount = useSelector(isExtensionSelector)
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
  console.log('isDemo', isDemo)

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
              <span className="extension">插件账户</span>
            ) : (
              <span className="extension">Signer账户</span>
            )}
          </h4>
          <p>{account.address}</p>
        </li>
      )}
      {signerConnected ? null : <SignerConnector />}
      {isExtensionAccount ? null : <ExtensionConnector />}
    </Wrapper>
  )
}
