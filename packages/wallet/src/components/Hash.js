import React from 'react'
import styled from 'styled-components'
import { ensure0xPrefix, remove0xPrefix } from '../utils'
import { useSelector } from 'react-redux'
import { networkSelector } from '../reducers/settingsSlice'
import { mainNetExplorer, testNetExplorer } from '../services/api'
import link from '../static/link.svg'
import linkHighlight from '../static/link-highlight.svg'

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

export default function({ hash = '', length = 5 }) {
  const network = useSelector(networkSelector)
  const host = network === 'testnet' ? testNetExplorer : mainNetExplorer
  const url = `${host}txs/${ensure0xPrefix(hash)}`

  let result = remove0xPrefix(hash)
  if (hash.length > 2 * length) {
    result = hash.substring(0, 5) + '...' + hash.substring(hash.length - 5)
  }

  return (
    <Wrapper href={url} target="_blank">
      <span>{ensure0xPrefix(result)}</span>
      <img className="link" src={link} alt="link" />
      <img
        className="link-highlight"
        src={linkHighlight}
        alt="link-highlight"
      />
    </Wrapper>
  )
}
