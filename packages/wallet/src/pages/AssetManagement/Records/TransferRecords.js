import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../reducers/addressSlice'
import { getChainx } from '../../../services/chainx'
import {
  fetchTransfers,
  loadedSelector
} from '../../../reducers/transactionSlice'
import { normalizedScrollTransfers } from './selectors'

const Wrapper = styled.ul`
  & > li {
    margin: 0 -16px;
    border-top: 1px solid #eee;
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
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 16px;
    }
  }
`

export default function() {
  const chainx = getChainx()

  const address = useSelector(addressSelector)
  const loaded = useSelector(loadedSelector)
  const transfers = useSelector(normalizedScrollTransfers)

  const accountId = chainx.account.decodeAddress(address, false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchTransfers(accountId))
    }
  }, [dispatch, accountId, loaded])

  return (
    <Wrapper>
      {transfers.map((transfer, index) => {
        return (
          <li key={index}>
            <header>
              <span>{transfer.token}</span>
              <span>{transfer.time}</span>
            </header>
            <main>
              <span>{transfer.value}</span>
              <span>{transfer.direction}</span>
            </main>
          </li>
        )
      })}
    </Wrapper>
  )
}
