import Wrapper from './Wrapper'
import React from 'react'
import Header from './Header'
import UserOrders from './UserOrders'

export default function() {
  return (
    <Wrapper>
      <Header />
      <UserOrders />
    </Wrapper>
  )
}
