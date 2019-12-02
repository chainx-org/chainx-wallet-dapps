import { useSelector } from 'react-redux'
import {
  currentShowPriceSelector,
  normalizedCurrentFillsSelector
} from '../selectors'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background: #ffffff;
  border-top: 1px solid #dce0e2;
  border-bottom: 1px solid #dce0e2;

  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  padding-left: 100px;
`

export default function() {
  const [latest] = useSelector(normalizedCurrentFillsSelector)

  const price = useSelector(currentShowPriceSelector)

  return (
    <Wrapper style={{ color: latest && latest.arise ? '#2caa84' : '#DC6E46' }}>
      {price}
    </Wrapper>
  )
}
