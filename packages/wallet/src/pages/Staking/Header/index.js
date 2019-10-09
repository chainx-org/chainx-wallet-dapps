import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.85);
`

export default function() {
  return <Wrapper>header</Wrapper>
}
