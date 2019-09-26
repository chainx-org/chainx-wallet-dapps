import React from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.section`
  border: 1px solid #dce0e2;
  border-radius: 10px;
  padding: 16px;
  background: #fff;

  ${props =>
    props.height &&
    css`
      height: ${props.height}px;
    `}
`

export default function(props) {
  return <Wrapper {...props}>{props.children}</Wrapper>
}
