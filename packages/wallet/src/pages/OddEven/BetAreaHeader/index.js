import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  betHeightSelector,
  betStatusSelector
} from '../../../reducers/oddevenSlice'
import $t from '../../../locale'
import Status from '../Status'

const Wrapper = styled.header`
  margin-top: 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Height = styled.section`
  display: inline-flex;
  background-image: linear-gradient(270deg, #cebe9e 1%, #bba383 98%);
  border-radius: 4px 100px 100px 4px;
  padding: 8px 18px;

  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0.12px;
  line-height: 24px;
`

export default function() {
  const betHeight = useSelector(betHeightSelector)
  const status = useSelector(betStatusSelector)

  return (
    <Wrapper>
      <Height>{$t('PREDICT_BET_HEIGHT', { height: betHeight })}</Height>
      <Status>{status}</Status>
    </Wrapper>
  )
}
