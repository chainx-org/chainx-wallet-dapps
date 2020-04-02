import styled from 'styled-components'
import { MiniLoading } from './index'
import React from 'react'

const LoadingWrapper = styled.section`
  display: flex;
  align-items: center;
  span {
    opacity: 0.56;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.2px;
    line-height: 16px;
  }
`

export default function({ text }) {
  return (
    <LoadingWrapper>
      <MiniLoading />
      <span>{text}</span>
    </LoadingWrapper>
  )
}
