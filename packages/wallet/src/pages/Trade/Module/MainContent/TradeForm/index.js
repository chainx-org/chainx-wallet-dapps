import React from 'react'
import Wrapper from './Wrapper'
import Buy from './Buy'
import Sell from './Sell'
import ReactTooltip from 'react-tooltip'

export default function() {
  return (
    <Wrapper>
      <Buy />
      <Sell />
      <ReactTooltip place="top" type="dark" effect="solid" />
    </Wrapper>
  )
}
