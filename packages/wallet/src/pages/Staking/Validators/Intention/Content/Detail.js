import React, { useRef } from 'react'
import styled from 'styled-components'
import { BoldValue, DotInCenter, Label } from './components'
import { useSelector } from 'react-redux'
import { pcxPrecisionSelector } from '../../../../selectors/assets'
import { noneFunc, toPrecision } from '../../../../../utils'
import { getChainx } from '../../../../../services/chainx'
import useOutsideClick from '../../../../../utils/useClickOutside'

const Wrapper = styled.div`
  position: absolute;
  z-index: 9;
  right: 0;
  top: 36px;
  .intention-detail {
    padding: 16px;
    background: rgb(255, 255, 255);
    border: 1px solid #dce0e2;
    border-radius: 10px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
    text-align: left;

    h3 {
      margin: 0 0 10px;
      opacity: 0.72;
      font-size: 16px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 24px;
    }

    p {
      margin: 0;
    }

    ul {
      margin: 0 -16px;
      background: #f2f3f4;
      min-width: 310px;
      padding-bottom: 10px;
      display: flex;
      flex-direction: column;
      li {
        margin-top: 8px;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
`

export default function({ intention, close = noneFunc }) {
  const {
    name,
    about,
    selfVote,
    totalNomination,
    jackpot,
    jackpotAccount,
    account
  } = intention
  const precision = useSelector(pcxPrecisionSelector)

  const popup = useRef(null)

  const chainx = getChainx()
  const jackpotAddress = chainx.account.decodeAddress(jackpotAccount, false)
  const accountAddress = chainx.account.decodeAddress(account, false)

  useOutsideClick(popup, () => {
    close()
  })

  return (
    <Wrapper>
      <div className="intention-detail" ref={popup}>
        <h3>
          <span>{name}</span>
        </h3>
        <p>{about}</p>
        <ul>
          <li>
            <Label>自抵押数</Label>
            <BoldValue>{toPrecision(selfVote, precision)}</BoldValue>
          </li>
          <li>
            <Label>总得票数</Label>
            <BoldValue>{toPrecision(totalNomination, precision)}</BoldValue>
          </li>
          <li>
            <Label>奖池金额</Label>
            <BoldValue>{toPrecision(jackpot, precision)}</BoldValue>
          </li>
          <li>
            <Label>奖池地址</Label>
            <DotInCenter text={jackpotAddress} length={5} />
          </li>
          <li>
            <Label>账户地址</Label>
            <DotInCenter text={accountAddress} length={5} />
          </li>
        </ul>
      </div>
    </Wrapper>
  )
}
