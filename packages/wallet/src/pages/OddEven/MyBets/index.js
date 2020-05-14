import styled from 'styled-components'
import React from 'react'
import { useSelector } from 'react-redux'
import { myBetsSelector } from '../../../reducers/oddevenSlice'
import evenLogo from './even.svg'
import oddLogo from './odd.svg'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { toPrecision } from '../../../utils'
import $t from '../../../locale'

export const Wrapper = styled.section`
  width: 300px;

  margin-left: 16px;

  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 10px;

  & > header {
    padding: 10px 16px;
    opacity: 0.72;
    font-weight: 600;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
    border-bottom: 1px solid #eeeeee;
  }

  ol {
    margin: 0;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      span {
        margin-left: 6px;
        opacity: 0.72;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;
      }

      &:not(:last-of-type) {
        border-bottom: 1px solid #eeeeee;
      }
    }
  }
`

export default function() {
  const myBets = useSelector(myBetsSelector)
  const precision = useSelector(pcxPrecisionSelector)

  return (
    <Wrapper>
      <header>{$t('PREDICT_MY_BETS')}</header>
      <ol>
        {myBets.map((bet, index) => (
          <li key={index}>
            <img src={bet.parity ? evenLogo : oddLogo} alt="logo" />
            <span>{toPrecision(bet.bet_balance, precision)} PCX</span>
          </li>
        ))}
      </ol>
    </Wrapper>
  )
}
