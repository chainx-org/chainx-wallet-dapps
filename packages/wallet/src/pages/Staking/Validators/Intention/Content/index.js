import React, { useState } from 'react'
import styled from 'styled-components'
import defaultLogo from '../../../svg/default-logo.svg'
import { pcxPrecisionSelector } from '../../../../selectors/assets'
import { useDispatch, useSelector } from 'react-redux'
import { toPrecision } from '../../../../../utils'
import $t from '../../../../../locale'
import { DefaultButton } from '@chainx/ui'
import LowSelfVote from '../../LowSelfVote'
import DetailToggle from './DetailToggle'
import Detail from './Detail'
import { accountIdSelector } from '../../../../../reducers/addressSlice'
import {
  setVoteIntention,
  setVoteOpen,
  voteOpenSelector
} from '../../../../../reducers/runStatusSlice'

const Wrapper = styled.div`
  display: flex;
  padding: 16px 16px 0;
  position: relative;
  & > div.info {
    display: flex;

    img {
      width: 40px;
      height: 40px;
    }
    div.summary {
      margin-left: 16px;
      header {
        span.name {
          opacity: 0.72;
          font-size: 14px;
          font-weight: 500;
          color: #000000;
          line-height: 20px;
        }
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
            width: 100px;
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
  }

  div.operation {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > div {
      text-align: right;
      img {
        cursor: pointer;
      }
    }

    button {
      font-size: 12px;
      letter-spacing: 0.2px;
      text-align: center;
      line-height: 16px;
    }
  }
`

export default function(props) {
  const accountId = useSelector(accountIdSelector)
  const dispatch = useDispatch()

  const {
    name,
    hasLogo,
    logo,
    selfVote,
    totalNomination,
    account
  } = props.intention
  const precision = useSelector(pcxPrecisionSelector)
  const voteOpen = useSelector(voteOpenSelector)

  const [detailOpen, setDetailOpen] = useState(false)
  const lowSelfVote = totalNomination >= selfVote * 10

  const isSelf = accountId === account
  const disabled = (!isSelf && lowSelfVote) || voteOpen

  return (
    <Wrapper>
      <div className="info">
        <img src={hasLogo ? logo : defaultLogo} alt="validator logo" />
        <div className="summary">
          <header>
            <span className="name">{name}</span>
            {lowSelfVote ? <LowSelfVote /> : null}
          </header>
          <ul>
            <li>
              <label>{$t('STAKING_TOTAL_NOMINATION')}</label>
              <span className="nomination">
                {parseInt(toPrecision(totalNomination, precision))}
              </span>
            </li>
            <li>
              <label>{$t('STAKING_SELF_VOTE')}</label>
              <span className="self-vote">
                {parseInt(toPrecision(selfVote, precision))}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="operation">
        <DetailToggle onClick={() => setDetailOpen(!detailOpen)} />
        <DefaultButton
          disabled={disabled}
          onClick={() => {
            dispatch(setVoteIntention(props.intention))
            dispatch(setVoteOpen(true))
          }}
          style={{
            padding: '6px 20px',
            fontSize: 12,
            color: `rbga(0, 0, 0, ${disabled ? 0.24 : 0.72}) !important`
          }}
        >
          {$t('STAKING_VOTE')}
        </DefaultButton>
      </div>
      {detailOpen && (
        <Detail
          intention={props.intention}
          close={() => setDetailOpen(false)}
        />
      )}
    </Wrapper>
  )
}
