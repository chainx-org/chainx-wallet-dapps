import React from 'react'
import Wrapper from './Wrapper'
import TradeForm from './TradeForm'
import Kline from './kline'

export default function() {
  return (
    <Wrapper className="content">
      <Kline />
      <TradeForm />
    </Wrapper>
  )
}
