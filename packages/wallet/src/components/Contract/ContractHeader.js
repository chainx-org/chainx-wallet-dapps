import React from 'react'
import styled from 'styled-components'
import $t from '../../locale'
import { NavLink } from 'react-router-dom'
import logo from '../../static/合约部署.svg'

const ContractHeader = styled.div`
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  position: absolute;
  top: 56px;
  left: 0;
  border-bottom: 1px solid #dce0e2;
  z-index: 1;
  .logo {
    width: 32px;
    padding-left: 16px;
    padding-right: 16px;
    border-right: 1px solid #eee;
  }
`

const Nav = styled.span`
  margin-left: 16px;
  height: 50px;
  &.last-nav {
    margin-left: 24px;
  }
  & > a {
    display: inline-flex;
    height: 100%;
    align-items: center;
    color: #000000;
    opacity: 0.32;
    text-decoration: none;
    &.active {
      opacity: 0.75;
      border-bottom: 3px solid #f6c94a;
    }
  }
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
`

export default function({ i }) {
  return (
    <ContractHeader>
      <div className="logo">
        <img src={logo} alt="contract-logo" />
      </div>
      <>
        <Nav>
          <NavLink exact activeClassName="active" to="/contract">
            {$t('CONTRACT')}
          </NavLink>
        </Nav>
        <Nav className="last-nav">
          <NavLink exact activeClassName="active" to="/contract/code">
            {$t('CODE')}
          </NavLink>
        </Nav>
      </>
    </ContractHeader>
  )
}
