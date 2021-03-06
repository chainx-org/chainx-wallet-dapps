import React, { useEffect } from 'react'
import {
  fetchWithdrawals,
  withdrawalsSelector
} from '../../../../../reducers/crosschainSlice'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Empty } from '../../../../../components'
import Line from './Line'
import { accountIdSelector } from '../../../../selectors/assets'

const Wrapper = styled.div`
  & > div {
    margin-top: 120px;
  }

  & > ul {
    & > li {
      user-select: none;
      position: relative;
      cursor: pointer;
      &:not(:first-of-type) {
        border-top: 1px solid #eee;
      }

      padding: 10px 16px;
      header,
      main {
        display: flex;
        justify-content: space-between;
      }
      header {
        opacity: 0.32;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;
      }

      main {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 500;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;

        span.text {
          opacity: 0.72;
        }

        .state {
          display: flex;
          img {
            margin-left: 8px;
            cursor: pointer;
          }
        }
      }
    }
  }
`

export default function() {
  const dispatch = useDispatch()
  const withdrawals = useSelector(withdrawalsSelector)

  const accountId = useSelector(accountIdSelector)

  useEffect(() => {
    dispatch(fetchWithdrawals(accountId))
  }, [dispatch, accountId])

  const withdrawalsElement = (
    <ul>
      {(withdrawals || []).map((withdrawal, index) => {
        return <Line withdrawal={withdrawal} key={index} />
      })}
    </ul>
  )

  return (
    <Wrapper>
      {(withdrawals || []).length > 0 ? (
        withdrawalsElement
      ) : (
        <div>
          <Empty text="暂无提现记录" />
        </div>
      )}
    </Wrapper>
  )
}
