import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import logo from './chainx.svg'
import { pcxInfoSelector } from '@reducers/assetSlice'

const Wrapper = styled.div`
  display: flex;
  max-height: 50px;
  img {
    margin-right: 20px;
    width: 50px;
  }

  section.info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`

const Title = styled.h6`
  margin: 0;
  opacity: 0.72;
  font-size: 18px;
  color: #000000;
  line-height: 28px;
`

const Desc = styled.span`
  position: relative;
  left: -8px;
  margin: 0;
  opacity: 0.8;
  font-size: 14px;
  color: #000000;

  background: #f6c94a;
  border-radius: 10px;
  padding: 2px 8px;
`

export default function() {
  const { info: { token, tokenName } = {} } = useSelector(pcxInfoSelector)

  return (
    <Wrapper>
      <img src={logo} alt="chainx logo" />
      <section className="info">
        <Title>{token}</Title>
        <Desc>{tokenName}</Desc>
      </section>
    </Wrapper>
  )
}
