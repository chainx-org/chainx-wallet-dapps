import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  max-height: 40px;
  color: #000000;
  img {
    margin-right: 16px;
    width: 40px;
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
  font-size: 16px;
  line-height: 28px;
`

const Desc = styled.span`
  margin: 0;
  opacity: 0.32;
  font-size: 12px;
  line-height: 16px;
`

export default function(props) {
  return (
    <Wrapper>
      <img src={props.logo} alt="logo" />
      <section className="info">
        <Title>{props.name}</Title>
        <Desc>{props.tokenName}</Desc>
      </section>
    </Wrapper>
  )
}
