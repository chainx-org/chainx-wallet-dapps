import React from 'react'
import styled from 'styled-components'
import defaultLogo from './svg/default-logo.svg'
import { pcxPrecisionSelector } from '../../../selectors/assets'
import { useSelector } from 'react-redux'
import { toPrecision } from '../../../../utils'
import $t from '../../../../locale'
import { DefaultButton } from '@chainx/ui'

const Wrapper = styled.div`
  display: flex;
  padding: 16px 16px 0;
  & > div.info {
    display: flex;

    img {
      width: 40px;
      height: 40px;
    }
    div.summary {
      margin-left: 16px;
      header {
        opacity: 0.72;
        font-size: 14px;
        font-weight: 500;
        color: #000000;
        line-height: 20px;
      }

      & > ul {
        display: flex;
        flex-direction: column;
        margin-top: 8px;

        li {
          label {
            opacity: 0.32;
            font-size: 12px;
            color: #000000;
            line-height: 16px;
          }

          span {
            display: inline-block;
            width: 150px;
            margin-left: 7px;
          }

          span.nomination {
            opacity: 0.72;
            font-size: 12px;
            color: #000000;
            line-height: 16px;
          }
          span.self-vote {
            font-weight: 500;
            font-size: 14px;
            color: #ecb417;
            line-height: 20px;
          }
        }
      }
    }

    div.operation {
      button {
        opacity: 0.72;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        text-align: center;
        line-height: 16px;
      }
    }
  }
`

export default function(props) {
  const { name, hasLogo, logo, selfVote, totalNomination } = props.intention
  const precision = useSelector(pcxPrecisionSelector)

  return (
    <Wrapper>
      <div className="info">
        <img src={hasLogo ? logo : defaultLogo} alt="validator logo" />
        <div className="summary">
          <header>{name}</header>
          <ul>
            <li>
              <label>{$t('STAKING_TOTAL_NOMINATION')}</label>
              <span className="nomination">
                {toPrecision(totalNomination, precision)}
              </span>
            </li>
            <li>
              <label>{$t('STAKING_SELF_VOTE')}</label>
              <span className="self-vote">
                {toPrecision(selfVote, precision)}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="operation">
        <DefaultButton
          onClick={() => console.log('click')}
          style={{ padding: 0 }}
        >
          {$t('STAKING_VOTE')}
        </DefaultButton>
      </div>
    </Wrapper>
  )
}
