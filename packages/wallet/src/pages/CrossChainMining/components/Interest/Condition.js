import React, { useRef } from 'react'
import successIcon from './success.svg'
import warningIcon from './warning.svg'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { headSelector } from '../../../../reducers/chainSlice'
import useOutsideClick from '../../../../utils/useClickOutside'
import { noneFunc, toPrecision } from '../../../../utils'
import { blockDuration, timeFormat } from '../../../../utils/constants'
import moment from 'moment'
import { pcxPrecisionSelector } from '../../../selectors/assets'

const Wrapper = styled.div`
  position: absolute;
  padding: 16px 0;
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
        margin: 0 0 8px;
        img {
          margin-right: 6px;
          margin-top: 2px;
          width: 16px;
        }
      }

      &:first-of-type {
        border-bottom: 1px solid #eeeeee;
      }

      &:not(:first-of-type) {
        padding-top: 12px;
      }

      & > div {
        margin-left: 22px;
        header {
          opacity: 0.32;
          font-size: 12px;
          color: #000000;
          letter-spacing: 0.2px;
          line-height: 16px;
        }
        p {
          opacity: 0.72;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0.12px;
          line-height: 20px;
        }
      }
    }
  }
`

export default function({ claimInfo, close = noneFunc }) {
  const { number: blockNumber, now } = useSelector(headSelector)
  const precision = useSelector(pcxPrecisionSelector)
  const {
    nextClaim,
    hasEnoughStaking,
    needStakingPcx,
    reachClaimHeight
  } = claimInfo

  const popup = useRef(null)

  const nextTime = (nextClaim - blockNumber) * blockDuration + now * 1000

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
          {reachClaimHeight ? null : (
            <div style={{ marginBottom: 8 }}>
              <header>下次可提息高度</header>
              <p>
                {nextClaim}（预估 {moment(nextTime).format(timeFormat)}）
              </p>
            </div>
          )}
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
          {hasEnoughStaking ? null : (
            <div>
              <header>预估需要增加投票冻结</header>
              <p>{toPrecision(needStakingPcx, precision)}PCX</p>
            </div>
          )}
        </li>
      </ul>
    </Wrapper>
  )
}
