import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import {
  depositsSelector,
  fetchDeposits
} from '../../../../reducers/crosschainSlice'
import styled from 'styled-components'
import { Empty } from '../../../../components'
import moment from 'moment'
import { timeFormat } from '../../../../utils/constants'
import { xbtcPrecisionSelector } from '../../../selectors/assets'
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
  const deposits = useSelector(depositsSelector)
  const precision = useSelector(xbtcPrecisionSelector)

  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address, false)

  useEffect(() => {
    dispatch(fetchDeposits(accountId))
  }, [dispatch, accountId])

  const depositsElement = (
    <ul>
      {(deposits || []).map((deposit, index) => {
        return (
          <li key={index}>
            <header>
              <span>X-BTC</span>
              <span>{moment(deposit['block.time']).format(timeFormat)}</span>
            </header>
            <main>
              <span>{toPrecision(deposit.balance, precision)}</span>
              <span>{deposit.txstate}</span>
            </main>
          </li>
        )
      })}
    </ul>
  )

  return (
    <Wrapper>
      {(deposits || []).length > 0 ? (
        depositsElement
      ) : (
        <div>
          <Empty text="暂无充值记录" />
        </div>
      )}
    </Wrapper>
  )
}
