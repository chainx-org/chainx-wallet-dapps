import React from 'react'
import { useSelector } from 'react-redux'
import { networkSelector } from '../../../../reducers/settingsSlice'
import { btcMainNetHost, btcTestNetHost } from '../../../../services/api'
import LinkWrapper from '../../../../components/common/LinkWrapper'
import link from '../../../../static/link.svg'
import linkHighlight from '../../../../static/link-highlight.svg'

export default function({ hash = '', length = 5 }) {
  const network = useSelector(networkSelector)
  const host = network === 'testnet' ? btcTestNetHost : btcMainNetHost
  const url = `${host}tx/${hash}`

  let result = hash
  if (hash.length > 2 * length) {
    result = hash.substring(0, 5) + '...' + hash.substring(hash.length - 5)
  }

  return (
    <LinkWrapper href={url} target="_blank">
      <span>{result}</span>
      <img className="link" src={link} alt="link" />
      <img
        className="link-highlight"
        src={linkHighlight}
        alt="link-highlight"
      />
    </LinkWrapper>
  )
}
