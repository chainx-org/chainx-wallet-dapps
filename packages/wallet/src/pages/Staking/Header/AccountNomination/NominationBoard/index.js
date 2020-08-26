import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import defaultLogo from '../../../svg/default-logo.svg'
import { DefaultButton } from '@chainx/ui'
import { toPrecision } from '../../../../../utils'
import More from './More'
import Claim from './Claim'
import { Label, Value } from './components'
import Empty from './Empty'
import $t from '../../../../../locale'
import {
  setVoteIntention,
  setVoteOpen
} from '../../../../../reducers/runStatusSlice'
import { nominationRecordsSelector } from '@reducers/validatorSlice'
import Address from '@components/Address'
import { pcxPrecisionSelector } from '@reducers/assetSlice'

const Wrapper = styled.div`
  display: flex;
  background: rgba(255, 255, 255);
  border: 1px solid #dce0e2;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  z-index: 90;

  position: absolute;
  top: 45px;
  right: 0;

  & > ul {
    & > li {
      &:not(:last-of-type) {
        border-bottom: 1px solid #eee;
      }

      padding: 16px 0;

      header {
        display: flex;
        justify-content: space-between;
        padding: 0 16px;
        div.name {
          display: flex;
          align-items: center;
          img {
            width: 24px;
          }
          span {
            margin-left: 12px;
            opacity: 0.72;
            font-weight: 500;
            font-size: 16px;
            color: #000000;
            letter-spacing: 0.12px;
            line-height: 24px;
          }
        }

        div.operations {
          display: flex;
        }
      }

      & > ul {
        display: flex;
        margin-top: 16px;
        li {
          display: flex;
          flex-direction: column;
          min-width: 110px;
          padding: 0 16px;

          &:not(:last-of-type) {
            border-right: 1px solid #eee;
          }
        }
      }
    }
  }
`

export default function() {
  const precision = useSelector(pcxPrecisionSelector)
  const dispatch = useDispatch()
  const records = useSelector(nominationRecordsSelector)

  return (
    <Wrapper>
      <ul>
        {records.map((record, index) => {
          const { account, rewardPotBalance: jackpot = 0 } =
            record.validator || {}
          const { nomination } = record.nomination || {}
          const interest = record.interest
          // const unfreeze = revocations.reduce((result, revocation) => {
          //   return result + revocation.value
          // }, 0)

          return (
            <li key={index}>
              <header>
                <div className="name">
                  <img src={defaultLogo} alt="logo" />
                  <span>
                    <Address address={account} />
                  </span>
                  {/*<span>{name}</span>*/}
                </div>
                <div className="operations">
                  {/*<Unfreeze revocations={revocations} record={record} />*/}
                  <DefaultButton
                    size="small"
                    style={{ marginRight: 8 }}
                    onClick={() => {
                      dispatch(setVoteIntention(record.intention))
                      dispatch(setVoteOpen(true))
                    }}
                  >
                    {$t('STAKING_VOTE')}
                  </DefaultButton>
                  <Claim target={account} />
                  <More intention={record} />
                </div>
              </header>
              <ul>
                <li>
                  <Label>{$t('COMMON_JACKPOT')}</Label>
                  <Value>{toPrecision(jackpot, precision)}</Value>
                </li>
                <li>
                  <Label>{$t('COMMON_UNFREEZE')}</Label>
                  {/*<Value>{toPrecision(unfreeze, precision)}</Value>*/}
                </li>
                <li>
                  <Label>{$t('STAKING_MY_NOMINATION')}</Label>
                  <Value>{toPrecision(nomination, precision)}</Value>
                </li>
                <li>
                  <Label>{$t('STAKING_INTEREST')}</Label>
                  <Value>{toPrecision(interest, precision)}</Value>
                </li>
              </ul>
            </li>
          )
        })}
      </ul>
      {records.length <= 0 ? <Empty /> : null}
    </Wrapper>
  )
}
