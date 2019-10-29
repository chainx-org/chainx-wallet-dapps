import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeposits } from '../../../../reducers/crosschainSlice'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import styled from 'styled-components'
import DepositList from './DepositList'

const Wrapper = styled.div`
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
`

export default function() {
  const dispatch = useDispatch()
  const address = useSelector(addressSelector)

  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address, false)

  useEffect(() => {
    dispatch(fetchDeposits(accountId))
  }, [dispatch, accountId])

  const [option, setOption] = useState('deposit')

  return (
    <Wrapper>
      <header>
        <ul>
          <li
            onClick={() => setOption('deposit')}
            className={option === 'deposit' ? 'active' : ''}
          >
            充值
          </li>
          <li
            onClick={() => setOption('withdraw')}
            className={option === 'withdraw' ? 'active' : ''}
          >
            提现
          </li>
          <li
            onClick={() => setOption('lock')}
            className={option === 'lock' ? 'active' : ''}
          >
            锁仓
          </li>
        </ul>
      </header>
      <main>{option === 'deposit' ? <DepositList /> : null}</main>
    </Wrapper>
  )
}
