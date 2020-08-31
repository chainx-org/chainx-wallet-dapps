import React from 'react'
import AskBid from './AskBid'
import MainContent from './MainContent'
import Fills from './Fills'
import Wrapper from './Wrapper'

export default function() {
  return (
    <Wrapper>
      <AskBid />
      <MainContent />
      <Fills />
    </Wrapper>
  )
}
