import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLocks,
  locksSelector
} from '../../../../../reducers/crosschainSlice'
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
      position: relative;
      cursor: pointer;
      user-select: none;
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
        opacity: 0.72;
        font-size: 12px;
        font-weight: 500;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;
      }
    }
  }
`

export default function() {
  const dispatch = useDispatch()
  const locks = useSelector(locksSelector)
  const accountId = useSelector(accountIdSelector)

  useEffect(() => {
    dispatch(fetchLocks(accountId))
  }, [dispatch, accountId])

  const lockElement = (
    <ul>
      {(locks || []).map((lock, index) => {
        return <Line lock={lock} key={index} />
      })}
    </ul>
  )

  return (
    <Wrapper>
      {(locks || []).length > 0 ? (
        lockElement
      ) : (
        <div>
          <Empty text="暂无锁仓记录" />
        </div>
      )}
    </Wrapper>
  )
}
