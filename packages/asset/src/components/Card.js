import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.section`
  border: 1px solid #dce0e2;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
`

export default function({ className, children }) {
  return <Wrapper className={className}>{children}</Wrapper>
}
