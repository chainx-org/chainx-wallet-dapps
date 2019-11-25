import React, { useState } from 'react'
import styled from 'styled-components'
import DepositList from './DepositList'
import WithdrawalList from './WithdrawalList'
import LockList from './LockList'
import $t from '../../../../locale'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  & > header {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    ul {
      display: flex;

      li {
        opacity: 0.32;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
        cursor: pointer;
        &:not(:first-of-type) {
          margin-left: 24px;
        }
        &.active {
          opacity: 0.72;
          font-weight: 500;
        }
      }
    }
  }

  & > main {
    flex: 1;
    overflow-y: auto;
  }
`

export default function() {
  const [option, setOption] = useState('deposit')

  return (
    <Wrapper>
      <header>
        <ul>
          <li
            onClick={() => setOption('deposit')}
            className={option === 'deposit' ? 'active' : ''}
          >
            {$t('ASSET_CROSS_CHAIN_DEPOSIT')}
          </li>
          <li
            onClick={() => setOption('withdraw')}
            className={option === 'withdraw' ? 'active' : ''}
          >
            {$t('ASSET_CROSS_CHAIN_WITHDRAWAL')}
          </li>
          <li
            onClick={() => setOption('lock')}
            className={option === 'lock' ? 'active' : ''}
          >
            {$t('ASSET_CROSS_CHAIN_LOCK')}
          </li>
        </ul>
      </header>
      <main>
        {option === 'deposit' ? <DepositList /> : null}
        {option === 'withdraw' ? <WithdrawalList /> : null}
        {option === 'lock' ? <LockList /> : null}
      </main>
    </Wrapper>
  )
}
