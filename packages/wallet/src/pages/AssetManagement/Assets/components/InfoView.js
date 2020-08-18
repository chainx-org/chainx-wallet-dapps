import React from 'react'
import styled, { css } from 'styled-components'
import Title from './Title'

const Info = styled.p`
  opacity: 0.72;
  font-size: 13px;
  color: #000000;
  line-height: 18px;
  ${props =>
    props.disabled &&
    css`
      opacity: 0.32;
    `}
`

export default React.memo(function({ className, title, info, disabled }) {
  return (
    <div className={className}>
      <Title>{title}</Title>
      <Info disabled={disabled}>{info}</Info>
    </div>
  )
})
