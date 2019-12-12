import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  depositsSelector,
  fetchDeposits
} from '../../../../../reducers/crosschainSlice'
import { Empty } from '../../../../../components'
import Wrapper from './Wrapper'
import Line from './Line'
import { accountIdSelector } from '../../../../selectors/assets'

export default function() {
  const dispatch = useDispatch()
  const deposits = useSelector(depositsSelector)
  const accountId = useSelector(accountIdSelector)

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
