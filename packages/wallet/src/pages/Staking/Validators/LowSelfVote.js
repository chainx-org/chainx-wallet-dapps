import React from 'react'
import styled from 'styled-components'
import $t from '../../../locale'

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  background: #ff3b30;
  border-radius: 9px;
  font-size: 11px;
  color: #ffffff;
  text-align: center;
  line-height: 14px;
  padding: 1px 5px;
  margin-left: 5px;
`

export default function() {
  return <Wrapper>{$t('STAKING_LOW_SELF_VOTE')}</Wrapper>
}
