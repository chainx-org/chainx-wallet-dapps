import React, { useRef } from 'react'
import $t from '../../../locale'
import { useDispatch, useSelector } from 'react-redux'
import {
  accountSelector,
  isDemoSelector,
  setAccount,
  signerConnectedSelector
} from '../../../reducers/addressSlice'
import signerIcon from './signer.svg'
import useOutsideClick from '../../../utils/useClickOutside'
import { noneFunc } from '../../../utils'
import { networkSelector } from '../../../reducers/settingsSlice'
import {
  mainNetDemoAccount,
  testNetDemoAccount
} from '../../../utils/constants'
import Wrapper from './Wrapper'
import SignerConnector from './SignerConnector'
import { openSignerDownloadDialogSelector } from '../../../reducers/runStatusSlice'

export default function({ close = noneFunc }) {
  const dispatch = useDispatch()
  const selectAccount = (name, address, isFromExtension) => {
    dispatch(setAccount({ name, address, isFromExtension }))
    setTimeout(() => window.location.reload(), 0)
  }

  const network = useSelector(networkSelector)
  const demoAccount =
    network === 'testnet'
      ? testNetDemoAccount.account
      : mainNetDemoAccount.account

  const demoAccountName = demoAccount.name
  const demoAccountAddress = demoAccount.address

  const hasExtension = !!window.chainxProvider
  const signerConnected = useSelector(signerConnectedSelector)
  const downloadSignerDialogOpen = useSelector(openSignerDownloadDialogSelector)

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    if (!downloadSignerDialogOpen) {
      close()
    }
  })

  const account = useSelector(accountSelector) || {}
  const isDemo = useSelector(isDemoSelector)

  return (
    <Wrapper ref={popup}>
      <li
        onClick={() =>
          selectAccount(demoAccountName, demoAccountAddress, false)
        }
      >
        <h4>{demoAccountName}</h4>
        <p>{demoAccountAddress}</p>
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
      {hasExtension ? null : (
        <li className="extension">
          <a
            href="https://chrome.google.com/webstore/detail/chainx-extension/dffjlgnecfafjfmkknpipapcbgajflge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={signerIcon} alt="extension" />
            <span>{$t('HEADER_GET_EXTENSION')}</span>
          </a>
        </li>
      )}
      {signerConnected ? null : <SignerConnector />}
    </Wrapper>
  )
}
