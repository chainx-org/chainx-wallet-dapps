import React, { useRef } from 'react'
import successIcon from './success.svg'
import warningIcon from './warning.svg'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { blockNumberSelector } from '../../../../reducers/chainSlice'
import useOutsideClick from '../../../../utils/useClickOutside'
import { noneFunc } from '../../../../utils'

const Wrapper = styled.div`
  position: absolute;
  background: rgba(255, 255, 255);
  border: 1px solid #dce0e2;
  border-radius: 10px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  z-index: 9;
  top: 30px;

  ul {
    li {
      padding: 0 16px;
      h3 {
        display: flex;
        align-items: flex-start;
        opacity: 0.72;
        font-weight: 500;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0.12px;
        line-height: 20px;
        img {
          margin-right: 6px;
          margin-top: 2px;
          width: 16px;
        }
      }

      &:first-of-type {
        border-bottom: 1px solid #eeeeee;
      }
    }
  }
`

export default function({ claimInfo, close = noneFunc }) {
  const blockNumber = useSelector(blockNumberSelector)
  const { nextClaim, hasEnoughStaking } = claimInfo

  const reachClaimHeight = nextClaim <= blockNumber

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    close()
  })

  return (
    <Wrapper ref={popup}>
      <ul>
        <li>
          <h3>
            <img
              src={reachClaimHeight ? successIcon : warningIcon}
              alt="icon"
            />
            <span>每次提息时间间隔不少于 7 天</span>
          </h3>
        </li>
        <li>
          <h3>
            <img
              src={hasEnoughStaking ? successIcon : warningIcon}
              alt="icon"
            />
            <span>
              PCX 投票冻结必须大于等于挖矿收益（包含推荐渠道收益）的 10倍
            </span>
          </h3>
        </li>
      </ul>
    </Wrapper>
  )
}
