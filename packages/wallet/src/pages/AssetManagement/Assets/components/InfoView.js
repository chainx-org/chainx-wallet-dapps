import React from 'react'
import styled from 'styled-components'
import Title from './Title'

const Info = styled.p`
  opacity: 0.72;
  font-size: 13px;
  color: #000000;
  line-height: 18px;
`

export default React.memo(function({ className, title, info }) {
  return (
    <div className={className}>
      <Title>{title}</Title>
      <Info>{info}</Info>
    </div>
  )
})
