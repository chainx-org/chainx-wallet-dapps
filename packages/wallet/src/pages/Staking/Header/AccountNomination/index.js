import React from 'react'
import styled from 'styled-components'
import {
  totalInterestSelector,
  totalNominationBalanceSelector,
  totalRevocationBalanceSelector
} from './selectors'
import { useSelector } from 'react-redux'

const Ul = styled.ul`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  & > li {
    display: inline-flex;
    flex-direction: column;
    min-width: 80px;

    & > label {
      opacity: 0.32;
      font-size: 12px;
      color: #000000;
      text-align: right;
      line-height: 16px;
    }
    & > span {
      display: inline-block;
      min-height: 20px;

      opacity: 0.72;
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 20px;
      text-align: right;
    }

    &:not(:first-of-type) {
      margin-left: 32px;
    }
  }
`

export default function() {
  const totalNomination = useSelector(totalNominationBalanceSelector)
  const totalRevocation = useSelector(totalRevocationBalanceSelector)
  const totalInterest = useSelector(totalInterestSelector)

  return (
    <Ul>
      <li>
        <label>待解冻</label>
        <span>{totalRevocation}</span>
      </li>
      <li>
        <label>我的投票</label>
        <span>{totalNomination}</span>
      </li>
      <li>
        <label>待领利息</label>
        <span>{totalInterest}</span>
      </li>
    </Ul>
  )
}
