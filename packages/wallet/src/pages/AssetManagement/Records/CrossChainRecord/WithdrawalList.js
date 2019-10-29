import React, { useEffect } from 'react'
import {
  fetchWithdrawals,
  withdrawalsSelector
} from '../../../../reducers/crosschainSlice'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import { xbtcPrecisionSelector } from '../../../selectors/assets'
import { getChainx } from '../../../../services/chainx'
import styled from 'styled-components'
import { Empty } from '../../../../components'
import moment from 'moment'
import { timeFormat } from '../../../../utils/constants'
import { toPrecision } from '../../../../utils'

const Wrapper = styled.div`
  & > div {
    margin-top: 30px;
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
  const withdrawals = useSelector(withdrawalsSelector)
  const precision = useSelector(xbtcPrecisionSelector)

  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address, false)

  useEffect(() => {
    dispatch(fetchWithdrawals(accountId))
  }, [dispatch, accountId])

  const withdrawalsElement = (
    <ul>
      {(withdrawals || []).map((withdrawal, index) => {
        return (
          <li key={index}>
            <header>
              <span>X-BTC</span>
              <span>{moment(withdrawal['block.time']).format(timeFormat)}</span>
            </header>
            <main>
              <span>{toPrecision(withdrawal.balance, precision)}</span>
              <span>{withdrawal.txstate}</span>
            </main>
          </li>
        )
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
