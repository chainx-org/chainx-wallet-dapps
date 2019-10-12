import React from 'react'
import styled from 'styled-components'
import NominationInfo from './NominationInfo'

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid #dce0e2;
`

export default function() {
  return (
    <Wrapper>
      <NominationInfo />
    </Wrapper>
  )
}
