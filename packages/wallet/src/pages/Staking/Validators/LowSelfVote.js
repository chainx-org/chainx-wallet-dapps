import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.span`
  background: #ff3b30;
  border-radius: 9px;
  font-size: 11px;
  color: #ffffff;
  text-align: center;
  line-height: 14px;
  padding: 1px 5px;
  margin-left: 5px;
`

export default function() {
  return <Wrapper>抵押过低</Wrapper>
}
