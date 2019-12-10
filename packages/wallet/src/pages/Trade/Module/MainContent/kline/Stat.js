import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.ul`
  position: absolute;
  display: flex;
  font-size: 12px;
  top: 36px;
  left: 16px;
  color: #9ca8c1;
  li:not(:first-of-type) {
    margin-left: 10px;
  }
`

export default function({ candle }) {
  return (
    <Wrapper>
      <li>O: {candle.open}</li>
      <li>H: {candle.high}</li>
      <li>L: {candle.low}</li>
      <li>C: {candle.close}</li>
      <li>V: {candle.volume}</li>
    </Wrapper>
  )
}
