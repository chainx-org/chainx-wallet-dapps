import React from 'react'
import styled, { css } from 'styled-components'
import Title from './Title'
import Amount from '../../../../components/Amount'
import { toPrecision } from '../../../../utils'

const Value = styled.p`
  opacity: 0.72;
  font-size: 13px;
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 18px;

  & > span {
    line-height: 18px;
  }

  ${props =>
    props.bold &&
    css`
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
    `}
`

export default React.memo(function(props) {
  return (
    <div className={props.className}>
      <Title>{props.title}</Title>
      <Value bold={props.bold}>
        {props.bold ? (
          toPrecision(props.value, props.precision)
        ) : (
          <Amount value={props.value} precision={props.precision} />
        )}
      </Value>
    </div>
  )
})
