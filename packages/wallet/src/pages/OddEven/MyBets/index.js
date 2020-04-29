import styled from 'styled-components'
import React from 'react'
import { useSelector } from 'react-redux'
import { myBetsSelector } from '../../../reducers/oddevenSlice'
import evenLogo from './even.svg'
import oddLogo from './odd.svg'

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

  return (
    <Wrapper>
      <header>我的竞猜</header>
      <ol>
        {myBets.map(bet => (
          <li>
            <img src={bet.isEven ? evenLogo : oddLogo} alt="logo" />
            <span>{bet.amount} PCX</span>
          </li>
        ))}
      </ol>
    </Wrapper>
  )
}
