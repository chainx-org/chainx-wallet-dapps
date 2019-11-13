import React from 'react'
import Xbtc from './XbtcCard'
import Lbtc from './LbtcCard'
import Sdot from './SdotCard'
import Xrc20Btc from './Xrc20BtcCard'
import { useSelector } from 'react-redux'
import { networkSelector } from '../../../reducers/settingsSlice'
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
  const network = useSelector(networkSelector)

  return (
    <Wrapper>
      <div className="first-line">
        <Xbtc />
        <Sdot />
        <Lbtc />
      </div>
      <div className="second-line">
        {network === 'testnet' ? <Xrc20Btc /> : null}
      </div>
    </Wrapper>
  )
}
