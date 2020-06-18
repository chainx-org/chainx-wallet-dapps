import { useSelector } from 'react-redux'
import { betHeightSelector } from '../../../reducers/oddevenSlice'
import React from 'react'
import styled from 'styled-components'
import { getLocale } from '../../../locale'

const ColorText = styled.span`
  color: ${props => props.color};
`

const Wrapper = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 40px;

  font-weight: 600;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0.14px;
  text-align: center;
  line-height: 32px;
`

export default function() {
  const betHeight = useSelector(betHeightSelector)
  const isZh = getLocale() !== 'en'

  if (!isZh) {
    return (
      <Wrapper>
        <ColorText color="#E05300">&nbsp;Odd&nbsp;</ColorText> or{' '}
        <ColorText color="#0086DC">&nbsp;Even&nbsp;</ColorText>
        of Bitcoin block{' '}
        <ColorText color="#AF946F"> &nbsp;{betHeight}</ColorText>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      Bitcoin块高&nbsp;<ColorText color="#AF946F">{betHeight}</ColorText>&nbsp;
      的交易哈希是
      <ColorText color="#E05300">&nbsp;奇数&nbsp;</ColorText> 还是{' '}
      <ColorText color="#0086DC">&nbsp;偶数&nbsp;</ColorText>
    </Wrapper>
  )
}
