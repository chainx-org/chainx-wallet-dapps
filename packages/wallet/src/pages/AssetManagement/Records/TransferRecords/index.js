import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransfers } from '../../../../reducers/transactionSlice'
import { normalizedScrollTransfers } from '../selectors'
import { Empty, MiniLoading } from '../../../../components'
import Line from './Line'
import { accountIdSelector } from '../../../selectors/assets'
import { useIsMounted } from '../../../../utils/hooks'
import { accountSelector } from '../../../../reducers/addressSlice'

const Wrapper = styled.div`
  & > div.empty {
    margin-top: 120px;
  }

  .line {
    cursor: pointer;
    position: relative;
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
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`

export default function() {
  const transfers = useSelector(normalizedScrollTransfers)
  const [loading, setLoading] = useState(true)

  const accountId = useSelector(accountIdSelector)
  const account = useSelector(accountSelector)
  const dispatch = useDispatch()
  const mounted = useIsMounted()

  useEffect(() => {
    setLoading(true)
    dispatch(fetchTransfers(account.address)).finally(() => {
      if (mounted.current) {
        setLoading(false)
      }
    })
  }, [dispatch, accountId, mounted])

  const transfersElement = transfers.map((transfer, index) => {
    return <Line transfer={transfer} key={index} />
  })

  if (loading) {
    return (
      <LoadingWrapper>
        <MiniLoading />
      </LoadingWrapper>
    )
  }

  return (
    <Wrapper>
      {(transfers || []).length > 0 ? (
        transfersElement
      ) : (
        <div className="empty">
          <Empty text="暂无转账记录" />
        </div>
      )}
    </Wrapper>
  )
}
