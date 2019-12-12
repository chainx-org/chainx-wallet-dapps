import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransfers,
  loadedSelector
} from '../../../../reducers/transactionSlice'
import { normalizedScrollTransfers } from '../selectors'
import { Empty } from '../../../../components'
import Line from './Line'
import { accountIdSelector } from '../../../selectors/assets'

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

export default function() {
  const loaded = useSelector(loadedSelector)
  const transfers = useSelector(normalizedScrollTransfers)

  const accountId = useSelector(accountIdSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchTransfers(accountId))
    }
  }, [dispatch, accountId, loaded])

  const transfersElement = transfers.map((transfer, index) => {
    return <Line transfer={transfer} key={index} />
  })

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
