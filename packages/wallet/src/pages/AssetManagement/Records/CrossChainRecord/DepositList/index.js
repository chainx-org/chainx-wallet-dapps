import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { getChainx } from '../../../../../services/chainx'
import {
  depositsSelector,
  fetchDeposits
} from '../../../../../reducers/crosschainSlice'
import { Empty } from '../../../../../components'
import moment from 'moment'
import { timeFormat } from '../../../../../utils/constants'
import { xbtcPrecisionSelector } from '../../../../selectors/assets'
import { toPrecision } from '../../../../../utils'
import Wrapper from './Wrapper'

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
