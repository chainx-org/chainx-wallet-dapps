import React from 'react'
import registerIcon from './register.svg'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: inline-flex;
  padding: 0 16px;
  border-left: 1px solid #eeeeee;
  height: 100%;
  cursor: pointer;
`

export default function() {
  return (
    <Wrapper>
      <img src={registerIcon} alt="register" />
    </Wrapper>
  )
}
