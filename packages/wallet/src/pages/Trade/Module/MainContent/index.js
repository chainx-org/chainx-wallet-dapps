import React from 'react'
import Wrapper from './Wrapper'
import Kline from './kline'
import TradeForm from './TradeForm'

export default function() {
  return (
    <Wrapper className="content">
      <Kline />
      <TradeForm />
    </Wrapper>
  )
}
