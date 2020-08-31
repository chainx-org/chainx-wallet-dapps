import { useSelector } from 'react-redux'
import React from 'react'
import styled from 'styled-components'
import { latestPriceSelector, pricePrecisionSelector } from '@reducers/dexSlice'
import { toPrecision } from '../../../../utils'

const Wrapper = styled.div`
  background: #ffffff;
  border-top: 1px solid #dce0e2;
  border-bottom: 1px solid #dce0e2;
  min-height: 24px;

  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  padding-left: 100px;
`

export default function() {
  const latestPrice = useSelector(latestPriceSelector)
  const precision = useSelector(pricePrecisionSelector)
  const arise = true

  return (
    <Wrapper
      // style={{ color: latest && latest.arise ? '#2caa84' : '#DC6E46' }}
      style={{ color: arise ? '#2caa84' : '#DC6E46' }}
    >
      {toPrecision(latestPrice, precision)}
    </Wrapper>
  )
}
