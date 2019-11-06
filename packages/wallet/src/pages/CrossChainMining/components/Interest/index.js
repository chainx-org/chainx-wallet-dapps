import styled from 'styled-components'
import { toPrecision } from '../../../../utils'
import { PrimaryButton } from '@chainx/ui'
import React from 'react'
import warningIcon from './warning.svg'
import successIcon from './success.svg'
import ReactTooltip from 'react-tooltip'
import { useSelector } from 'react-redux'
import { blockNumberSelector } from '../../../../reducers/chainSlice'

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  label {
    opacity: 0.32;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.2px;
    line-height: 16px;
    margin-right: 8px;
  }
  & > span {
    display: inline-flex;
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 24px;
    min-width: 200px;
    & > span {
      display: inline-flex;
      align-items: center;
    }
    img {
      margin-left: 6px;
      width: 16px;
    }
    span.interest {
      opacity: 0.72;
    }

    .condition {
      background: rgba(255, 255, 255);
      border: 1px solid #dce0e2;
      border-radius: 10px;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
      &:hover {
        visibility: visible !important;
        opacity: 1 !important;
      }
    }

    ul {
      li {
        h3 {
          display: flex;
          opacity: 0.72;
          font-weight: 500;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0.12px;
          line-height: 20px;
          img {
            margin-right: 6px;
          }
        }

        &:first-of-type {
          border-bottom: 1px solid #eeeeee;
        }
      }
    }
  }

  button {
    width: 84px;
    span {
      width: 84px !important;
      font-size: 14px !important;
    }
  }
`

export default function(props) {
  const blockNumber = useSelector(blockNumberSelector)
  const { interest, precision, claim, token, disabled, claimInfo = {} } = props
  const { canClaim, nextClaim, hasEnoughStaking } = claimInfo

  const reachClaimHeight = nextClaim <= blockNumber

  const tooltipId = `${token}-hover`

  return (
    <Wrapper>
      <label>待提利息</label>
      <span>
        <span className="interest">{toPrecision(interest, precision)} PCX</span>
        {interest > 0 && !canClaim ? (
          <span>
            <img src={warningIcon} alt="" data-tip data-for={tooltipId} />
            <ReactTooltip
              id={tooltipId}
              place="bottom"
              effect="solid"
              type="light"
              className="condition"
            >
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
                      PCX 投票冻结必须大于等于挖矿收益（包含推荐渠道收益）的 10
                      倍
                    </span>
                  </h3>
                </li>
              </ul>
            </ReactTooltip>
          </span>
        ) : null}
      </span>
      <PrimaryButton
        disabled={!canClaim || disabled}
        size="small"
        onClick={() => claim(token)}
      >
        提息
      </PrimaryButton>
    </Wrapper>
  )
}
