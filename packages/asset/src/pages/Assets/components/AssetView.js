import React from 'react'
import styled, { css } from 'styled-components'
import { toPrecision } from '../../../utils'

const Title = styled.h6`
  opacity: 0.32;
  font-size: 14px;
  color: #000000;
  line-height: 20px;
  font-weight: 300;
`

const Value = styled.p`
  opacity: 0.72;
  font-size: 13px;
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 18px;

  ${props =>
    props.bold &&
    css`
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
    `}
`

export default function(props) {
  return (
    <div className={props.className}>
      <Title>{props.title}</Title>
      <Value bold={props.bold}>
        {toPrecision(props.value, props.precision)}
      </Value>
    </div>
  )
}
