import React, { useRef } from 'react'
import $t from '../../../locale'
import { useDispatch, useSelector } from 'react-redux'
import {
  extensionAccountsSelector,
  setAccount
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

export default function({ close = noneFunc }) {
  const extensionAccounts = useSelector(extensionAccountsSelector)
  const dispatch = useDispatch()
  const selectAccount = (name, address, isFromExtension) => {
    dispatch(setAccount({ name, address, isFromExtension }))
    setTimeout(() => window.location.reload(), 0)
  }

  const network = useSelector(networkSelector)
  const demoAccount =
    network === 'testnet' ? testNetDemoAccount : mainNetDemoAccount

  const demoAccountName = demoAccount.name
  const demoAccountAddress = demoAccount.address

  const hasExtension = !!window.chainxProvider

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    close()
  })

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
      {extensionAccounts.map(account => {
        return (
          <li
            onClick={() => selectAccount(account.name, account.address, true)}
            key={account.address}
          >
            <h4>
              <span>{account.name}</span>
              <span className="extension">插件账户</span>
            </h4>
            <p>{account.address}</p>
          </li>
        )
      })}
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
    </Wrapper>
  )
}
