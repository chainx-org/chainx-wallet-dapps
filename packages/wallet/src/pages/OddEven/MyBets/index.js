import styled from 'styled-components'
import React from 'react'
import { useSelector } from 'react-redux'
import { myBetsSelector } from '../../../reducers/oddevenSlice'
import evenLogo from './even.svg'
import oddLogo from './odd.svg'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { toPrecision } from '../../../utils'
import $t from '../../../locale'
import moment from 'moment'
import { timeFormat } from '../../../utils/constants'
import { Empty } from '../../../components'

export const Wrapper = styled.section`
  width: 300px;
  margin-left: 16px;
  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  & > div {
    flex: 1;
    overflow-y: auto;
  }

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
      flex-direction: column;
      padding: 10px 16px;
      div.time {
        opacity: 0.32;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;
      }

      div.bet {
        margin-top: 4px;
        display: flex;
        align-items: center;

        span {
          margin-left: 6px;
          opacity: 0.72;
          font-size: 12px;
          color: #000000;
          letter-spacing: 0.2px;
          line-height: 16px;
        }
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
      <div>
        {myBets.length > 0 ? (
          <ol>
            {myBets.map((bet, index) => (
              <li key={index}>
                <div className="time">
                  {moment(bet.start_time * 1000).format(timeFormat)}
                </div>
                <div className="bet">
                  <img src={bet.parity ? evenLogo : oddLogo} alt="logo" />
                  <span>{toPrecision(bet.bet_balance, precision)} PCX</span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <Empty style={{ marginTop: 20 }} text={$t('PREDICT_NO_BETS')} />
        )}
      </div>
    </Wrapper>
  )
}
