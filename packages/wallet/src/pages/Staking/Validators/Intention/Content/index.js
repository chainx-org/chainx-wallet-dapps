import React, { useState } from 'react'
import styled from 'styled-components'
import defaultLogo from '../../../svg/default-logo.svg'
import { pcxPrecisionSelector } from '../../../../selectors/assets'
import { useSelector } from 'react-redux'
import { toPrecision } from '../../../../../utils'
import $t from '../../../../../locale'
import { DefaultButton } from '@chainx/ui'
import VoteDialog from '../../../VoteDialog'
import LowSelfVote from '../../LowSelfVote'
import DetailToggle from './DetailToggle'
import Detail from './Detail'

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
      opacity: 0.72;
      font-size: 12px;
      color: #000000;
      letter-spacing: 0.2px;
      text-align: center;
      line-height: 16px;
    }
  }
`

export default function(props) {
  const {
    name,
    hasLogo,
    logo,
    selfVote,
    totalNomination,
    isActive
  } = props.intention
  const precision = useSelector(pcxPrecisionSelector)
  const [voteOpen, setVoteOpen] = useState(false)

  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <Wrapper>
      <div className="info">
        <img src={hasLogo ? logo : defaultLogo} alt="validator logo" />
        <div className="summary">
          <header>
            <span className="name">{name}</span>
            {isActive && totalNomination >= selfVote * 10 ? (
              <LowSelfVote />
            ) : null}
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
          onClick={() => setVoteOpen(true)}
          style={{
            padding: '6px 20px',
            fontSize: 12,
            opacity: 0.72,
            color: '#000'
          }}
        >
          {$t('STAKING_VOTE')}
        </DefaultButton>
      </div>
      {voteOpen && (
        <VoteDialog
          handleClose={() => setVoteOpen(false)}
          intention={props.intention}
        />
      )}
      {detailOpen && (
        <Detail
          intention={props.intention}
          close={() => setDetailOpen(false)}
        />
      )}
    </Wrapper>
  )
}
