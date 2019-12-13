import React from 'react'
import styled from 'styled-components'
import wallets from './wallets'
import ReactTooltip from 'react-tooltip'
import $t from '../../../../../locale'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
  opacity: 1;
  font-size: 14px;
  color: #3f3f3f;
  text-align: justify;
  line-height: 20px;
  a {
    text-decoration: none;
    font-size: 14px;
    color: #087fc2;
    text-align: justify;
    line-height: 20px;
  }
  img {
    max-height: 400px;
  }
`

export default function() {
  return (
    <Wrapper>
      <span>{$t('ASSET_OP_RETURN_WALLETS')}</span>
      {wallets.map((wallet, index) => {
        return (
          <span key={index}>
            <a href={wallet.url} data-tip data-for={wallet.text}>
              {wallet.text}
            </a>
            、
            <ReactTooltip id={wallet.text}>
              <img src={wallet.img} alt="" />
            </ReactTooltip>
          </span>
        )
      })}
    </Wrapper>
  )
}
