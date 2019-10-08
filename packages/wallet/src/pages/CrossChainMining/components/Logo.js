import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  img {
    width: 30px;
  }
`

const Title = styled.h6`
  margin-left: 12px;
  font-weight: 600;
  opacity: 0.72;
  font-size: 16px;
  color: #000000;
  line-height: 24px;
`

export default function(props) {
  return (
    <Wrapper>
      <img src={props.icon} alt="logo" />
      <Title>{props.name}</Title>
    </Wrapper>
  )
}
