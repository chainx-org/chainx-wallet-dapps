import { useSelector } from 'react-redux'
import { networkSelector } from '../reducers/settingsSlice'
import { mainNetExplorer, testNetExplorer } from '../services/api'
import { getChainx } from '../services/chainx'
import link from '../static/link.svg'
import linkHighlight from '../static/link-highlight.svg'
import React from 'react'
import styled from 'styled-components'

export const Wrapper = styled.a`
  &:hover {
    color: #0088cc;
    opacity: 1;
    img.link {
      display: none;
    }
    img.link-highlight {
      display: inline-block;
    }
  }
  opacity: 0.56;
  font-size: 13px;
  color: #000000;
  letter-spacing: 0.2px;
  text-align: right;
  line-height: 18px;
  text-decoration: none;
  img {
    margin-left: 6px;
  }
  img.link-highlight {
    display: none;
  }
`

export default function({ address = '', length = 5 }) {
  const network = useSelector(networkSelector)
  const host = network === 'testnet' ? testNetExplorer : mainNetExplorer
  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address)
  const url = `${host}accounts/${accountId}`

  let result = address
  if (address.length > 2 * length) {
    result =
      address.substring(0, 5) + '...' + address.substring(address.length - 5)
  }

  return (
    <Wrapper href={url} target="_blank">
      <span>{result}</span>
      <img className="link" src={link} alt="link" />
      <img
        className="link-highlight"
        src={linkHighlight}
        alt="link-highlight"
      />
    </Wrapper>
  )
}
