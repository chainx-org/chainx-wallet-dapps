import React from 'react'
import $t from '../../locale'
import styled from 'styled-components'

const Wrapper = styled.span`
  opacity: 0.72;
  font-weight: 600;
  font-size: 12px;
  color: #000000;
  letter-spacing: 0.2px;
  text-align: right;
  line-height: 16px;
`

export default function({ status }) {
  return (
    <Wrapper>
      {status.value === 'Confirming'
        ? `(${status.confirm}/${status.confirm})`
        : ''}
      {$t(`TRUST_STATUS_${(status.value || '').toUpperCase()}`)}
    </Wrapper>
  )
}
