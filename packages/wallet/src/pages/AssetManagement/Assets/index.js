import React from 'react'
import Xbtc from './XbtcCard'
import styled from 'styled-components'
import Power from '@pages/AssetManagement/Power'

const Wrapper = styled.section`
  & > div {
    margin-top: 16px;
    display: flex;

    &.first-line {
      & > section {
        flex: 1;

        &:not(:first-of-type) {
          margin-left: 16px;
        }
      }
    }
  }
`

export default function() {
  return (
    <Wrapper>
      <div className="first-line">
        <Xbtc />
        <Power />
      </div>
    </Wrapper>
  )
}
