import React from 'react'
import { ensure0xPrefix, remove0xPrefix } from '../utils'
import { useSelector } from 'react-redux'
import { networkSelector } from '../reducers/settingsSlice'
import { mainNetExplorer, testNetExplorer } from '../services/api'
import link from '../static/link.svg'
import linkHighlight from '../static/link-highlight.svg'
import LinkWrapper from './common/LinkWrapper'

export default function({ hash = '', length = 5 }) {
  const network = useSelector(networkSelector)
  const host = network === 'testnet' ? testNetExplorer : mainNetExplorer
  const url = `${host}txs/${ensure0xPrefix(hash)}`

  let result = remove0xPrefix(hash)
  if (hash.length > 2 * length) {
    result = hash.substring(0, 5) + '...' + hash.substring(hash.length - 5)
  }

  return (
    <LinkWrapper href={url} target="_blank">
      <span>{ensure0xPrefix(result)}</span>
      <img className="link" src={link} alt="link" />
      <img
        className="link-highlight"
        src={linkHighlight}
        alt="link-highlight"
      />
    </LinkWrapper>
  )
}
