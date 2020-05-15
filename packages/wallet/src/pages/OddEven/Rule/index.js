import React from 'react'
import $t from '../../../locale'
import styled from 'styled-components'
import ruleIcon from './rule.svg'

const Rule = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  opacity: 0.72;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.12px;
  line-height: 20px;

  img {
    margin-right: 6px;
  }
`

export default function(props) {
  return (
    <Rule {...props}>
      <img src={ruleIcon} alt="" />
      {$t('PREDICT_RULE')}
    </Rule>
  )
}
