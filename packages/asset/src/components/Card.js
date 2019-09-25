import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.section`
  border: 1px solid #dce0e2;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
`

export default function(props) {
  return <Wrapper>{props.children}</Wrapper>
}
