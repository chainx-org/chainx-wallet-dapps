import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWithdrawals } from '../../reducers/trustSlice'
import { withdrawalsSelector } from '../../reducers/trustSlice'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export default function() {
  const dispatch = useDispatch()
  const withdrawals = useSelector(withdrawalsSelector)

  useEffect(() => {
    dispatch(fetchWithdrawals())
  }, [dispatch])

  return <Wrapper>{withdrawals.length} withdrawals</Wrapper>
}
