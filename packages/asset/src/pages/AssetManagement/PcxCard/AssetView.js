import React from 'react'
import styled, { css } from 'styled-components'
import { toPrecision } from '../../../utils'

const Title = styled.h6`
  margin: 0;
  opacity: 0.32;
  font-size: 14px;
  color: #000000;
  line-height: 20px;
`

const Value = styled.p`
  margin: 4px 0 0;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  font-weight: 600;

  ${props =>
    props.bold &&
    css`
      font-size: 24px;
      line-height: 36px;
    `}
`

export default function(props) {
  return (
    <div>
      <Title>{props.title}</Title>
      <Value bold={props.bold}>
        {toPrecision(props.value, props.precision)}
      </Value>
    </div>
  )
}
