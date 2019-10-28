import React from 'react'
import noneLogo from './none.svg'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  section {
    text-align: center;
  }

  img {
    width: 56px;
  }

  p {
    margin-top: 8px;
    opacity: 0.24;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    text-align: center;
    line-height: 20px;
  }
`

export default function(props) {
  return (
    <Wrapper>
      <section>
        <img src={noneLogo} alt="empty" />
      </section>
      <p>{props.text}</p>
    </Wrapper>
  )
}
