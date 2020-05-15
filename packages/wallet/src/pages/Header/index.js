import React, { useState } from 'react'
import styled from 'styled-components'
import $t from '../../locale'
import mainNetLogo from './logo.svg'
import testNetLogoEn from './testnet-en.svg'
import testNetLogoZh from './testnet-zh.svg'
import txsIcon from './txs.svg'
import { NavLink } from 'react-router-dom'
import Name from './Name'
import { useDispatch, useSelector } from 'react-redux'
import { localeSelector, networkSelector } from '../../reducers/settingsSlice'
import AccountList from './AccountList'
import DownloadSignerDialog from './DownloadSignerDialog'
import DownloadExtensionDialog from './DownloadExtensionDialog'
import {
  openExtensionDownloadDialogSelector,
  openSignerDownloadDialogSelector,
  setOpenExtensionDownloadDialog,
  setOpenSignerDownloadDialog
} from '../../reducers/runStatusSlice'

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: #3f3f3f;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
  height: 56px;
  color: #ffffff;

  & > div {
    display: flex;
    align-items: center;
    & > img {
      height: 24px;
    }

    &.right {
      height: 100%;
      & > span:first-child {
        img {
          margin-right: 6px;
        }
        margin-right: 24px;
      }
    }
  }
`

const Nav = styled.span`
  display: inline-flex;
  height: 100%;
  margin-left: 23px;
  & > a {
    display: inline-flex;
    height: 100%;
    align-items: center;
    opacity: 0.5;
    color: #fff;
    text-decoration: none;

    &.active {
      opacity: 0.8;
    }
  }
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
  cursor: pointer;
`

export default function() {
  const locale = useSelector(localeSelector)
  const network = useSelector(networkSelector)

  let logo = mainNetLogo
  if (network === 'testnet') {
    logo = locale === 'zh' ? testNetLogoZh : testNetLogoEn
  }

  const [showList, setShowList] = useState(false)
  const dispatch = useDispatch()
  const handleSignerDownloadClose = () => {
    dispatch(setOpenSignerDownloadDialog(false))
  }
  const handleExtensionDownloadClose = () => {
    dispatch(setOpenExtensionDownloadDialog(false))
  }

  const downloadSignerDialogOpen = useSelector(openSignerDownloadDialogSelector)
  const downloadExtensionDialogOpen = useSelector(
    openExtensionDownloadDialogSelector
  )

  return (
    <Wrapper>
      <div className="left">
        <img src={logo} alt="logo" />
        <Nav active>
          <NavLink exact activeClassName="active" to="/">
            {$t('ASSET')}
          </NavLink>
        </Nav>
        <Nav>
          <NavLink exact activeClassName="active" to="/mining">
            {$t('PSEDU_INTENTION')}
          </NavLink>
        </Nav>
        <Nav>
          <NavLink exact activeClassName="active" to="/staking">
            {$t('STAKING')}
          </NavLink>
        </Nav>
        <Nav>
          <NavLink exact activeClassName="active" to="/trust">
            {$t('TRUST')}
          </NavLink>
        </Nav>
        <Nav>
          <NavLink exact activeClassName="active" to="/trade">
            {$t('TRADE')}
          </NavLink>
        </Nav>
        {network === 'testnet' && (
          <>
            <Nav>
              <NavLink activeClassName="active" to="/contract">
                {$t('CONTRACTINDEX')}
              </NavLink>
            </Nav>
          </>
        )}
        {network === 'testnet' && (
          <Nav>
            <NavLink exact activeClassName="active" to="/oddeven">
              预测BTC
            </NavLink>
          </Nav>
        )}
      </div>
      <div className="right">
        <Nav>
          <NavLink activeClassName="active" to="/txs">
            <img src={txsIcon} alt="txs" />
            {$t('HEADER_TXS')}
          </NavLink>
        </Nav>
        <Name onClick={() => setShowList(true)} />
      </div>
      {showList ? <AccountList close={() => setShowList(false)} /> : null}
      {downloadSignerDialogOpen ? (
        <DownloadSignerDialog handleClose={handleSignerDownloadClose} />
      ) : null}
      {downloadExtensionDialogOpen ? (
        <DownloadExtensionDialog handleClose={handleExtensionDownloadClose} />
      ) : null}
    </Wrapper>
  )
}
