import React from 'react'
import styled, { css } from 'styled-components'
import $t from '../../locale'
import logo from './logo.svg'

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #3f3f3f;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
  height: 56px;
  color: #ffffff;

  & > img {
    height: 24px;
  }
`

const Nav = styled.span`
  margin-left: 23px;
  opacity: 0.5;
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
  cursor: pointer;

  ${props =>
    props.active &&
    css`
      opacity: 0.8;
    `}
`

export default function() {
  return (
    <Wrapper>
      <img src={logo} alt="logo" />
      <Nav active>{$t('ASSET')}</Nav>
      <Nav>{$t('PSEDU_INTENTION')}</Nav>
    </Wrapper>
  )
}
