import styled from 'styled-components'
import React from 'react'

const LinkWrapper = styled.a`
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  color: #0088cc;
  letter-spacing: 0.12px;
  line-height: 20px;
`

export default function({ children }) {
  const url = `https://live.blockcypher.com/btc/block/${children}`
  const result =
    children.substring(0, 1) + '...' + children.substring(children.length - 20)

  return (
    <LinkWrapper href={url} target="_blank">
      {result}
    </LinkWrapper>
  )
}
