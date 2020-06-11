import { useSelector } from 'react-redux'
import { oddEvenBalanceSelector } from '../../reducers/oddevenSlice'
import styled from 'styled-components'
import React from 'react'
import $t from '../../locale'
import { toPrecision } from '../../utils'
import { pcxPrecisionSelector } from '../selectors/assets'

const Wrapper = styled.div`
  span:first-of-type {
    opacity: 0.32;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
  }

  span:last-of-type {
    opacity: 0.72;
    font-weight: 600;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
  }
`

export default function() {
  const balance = useSelector(oddEvenBalanceSelector)
  const precision = useSelector(pcxPrecisionSelector)

  return (
    <Wrapper>
      <span>{$t('ASSET_BALANCE')}</span>
      <span>{toPrecision(balance, precision)} PCX</span>
    </Wrapper>
  )
}
