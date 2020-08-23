import React from 'react'
import Xbtc from './XbtcCard'
import Xrc20Btc from './Xrc20BtcCard'
import { useSelector } from 'react-redux'
import { isTestNetSelector } from '../../../reducers/settingsSlice'
import styled from 'styled-components'

const Wrapper = styled.section`
  & > div {
    margin-top: 16px;
    display: flex;

    &.first-line {
      & > section {
        width: calc(33% - 8px);

        &:not(:first-of-type) {
          margin-left: 16px;
        }
      }
    }

    &.second-line {
      & > section {
        width: calc(33% - 40px);
      }
    }
  }
`

export default function() {
  const isTestNet = useSelector(isTestNetSelector)

  return (
    <Wrapper>
      <div className="first-line">
        <Xbtc />
      </div>
      <div className="second-line">{isTestNet && <Xrc20Btc />}</div>
    </Wrapper>
  )
}
