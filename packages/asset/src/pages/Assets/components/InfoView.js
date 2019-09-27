import React from 'react'
import styled from 'styled-components'
import Title from './Title'

const Info = styled.p`
  opacity: 0.72;
  font-size: 13px;
  color: #000000;
  line-height: 18px;
`

export default function(props) {
  return (
    <div className={props.className}>
      <Title>{props.title}</Title>
      <Info>{props.info}</Info>
    </div>
  )
}
