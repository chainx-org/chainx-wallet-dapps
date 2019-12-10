import Wrapper from './Wrapper'
import React, { useState } from 'react'
import Header from './Header'
import UserOrders from './UserOrders'
import HistoryOrders from './HistoryOrders'

export default function() {
  const [idx, setIdx] = useState(0)

  return (
    <Wrapper>
      <Header idx={idx} setIdx={setIdx} />
      {idx === 0 ? <UserOrders /> : <HistoryOrders />}
    </Wrapper>
  )
}
