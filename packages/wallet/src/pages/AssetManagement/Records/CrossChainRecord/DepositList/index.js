import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { getChainx } from '../../../../../services/chainx'
import {
  depositsSelector,
  fetchDeposits
} from '../../../../../reducers/crosschainSlice'
import { Empty } from '../../../../../components'
import Wrapper from './Wrapper'
import Line from './Line'

export default function() {
  const dispatch = useDispatch()
  const address = useSelector(addressSelector)
  const deposits = useSelector(depositsSelector)

  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address, false)

  useEffect(() => {
    dispatch(fetchDeposits(accountId))
  }, [dispatch, accountId])

  const depositsElement = (
    <ul>
      {(deposits || []).map((deposit, index) => {
        return <Line deposit={deposit} key={index} />
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
