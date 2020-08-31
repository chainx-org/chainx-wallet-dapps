import Wrapper from './Wrapper'
import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '@reducers/addressSlice'
import { getAccountOrders } from '@reducers/dexSlice'

export default function() {
  const [idx, setIdx] = useState(0)

  const address = useSelector(addressSelector)
  const dispatch = useDispatch()
  console.log('address', address)

  useEffect(() => {
    dispatch(getAccountOrders(address))
  }, [dispatch, address])

  return (
    <Wrapper>
      <Header idx={idx} setIdx={setIdx} />
      {/*{idx === 0 ? <UserOrders /> : <HistoryOrders />}*/}
    </Wrapper>
  )
}
