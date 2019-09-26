import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  min-height: 72px;
`

const Title = styled.h5`
  margin: 0;
  opacity: 0.72;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0.1px;
  line-height: 28px;
`

const Address = styled.p`
  margin: 0;
  opacity: 0.72;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0.1px;
  line-height: 28px;
`

export default function() {
  const account = useSelector(state => state.address)

  return (
    <Wrapper>
      <Title>{(account.name || '').toUpperCase()}</Title>
      <Address>{account.address}</Address>
    </Wrapper>
  )
}
