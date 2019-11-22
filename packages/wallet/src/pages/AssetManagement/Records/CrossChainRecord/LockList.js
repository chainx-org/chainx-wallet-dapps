import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import { fetchLocks, locksSelector } from '../../../../reducers/crosschainSlice'
import { lbtcPrecisionSelector } from '../../../selectors/assets'
import { getChainx } from '../../../../services/chainx'
import styled from 'styled-components'
import { Empty } from '../../../../components'
import moment from 'moment'
import { timeFormat } from '../../../../utils/constants'
import { toPrecision } from '../../../../utils'

const Wrapper = styled.div`
  & > div {
    margin-top: 120px;
  }

  ul {
    li {
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
  const address = useSelector(addressSelector)
  const locks = useSelector(locksSelector)
  const precision = useSelector(lbtcPrecisionSelector)

  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address, false)

  useEffect(() => {
    dispatch(fetchLocks(accountId))
  }, [dispatch, accountId])

  const lockElement = (
    <ul>
      {(locks || []).map((lock, index) => {
        return (
          <li key={index}>
            <header>
              <span>L-BTC</span>
              <span>{moment(lock.lock_time).format(timeFormat)}</span>
            </header>
            <main>
              <span>
                {lock.type === 0 ? '+' : '-'}
                {toPrecision(lock.value, precision)}
              </span>
              <span>{lock.type === 0 ? '锁仓' : '解锁'}</span>
            </main>
          </li>
        )
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
