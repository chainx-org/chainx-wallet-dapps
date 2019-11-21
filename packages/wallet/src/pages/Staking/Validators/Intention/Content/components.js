import styled from 'styled-components'
import React from 'react'

export const Label = styled.label`
  opacity: 0.32;
  font-size: 13px;
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 18px;
`

export const Value = styled.span`
  opacity: 0.72;
  font-size: 13px;
  color: #000000;
  letter-spacing: 0.2px;
  text-align: right;
  line-height: 18px;
`

export const BoldValue = styled(Value)`
  font-weight: 600;
`

export function DotInCenter({ text = '', length = 5 }) {
  let result = text
  if (text.length > 2 * length) {
    result = text.substring(0, 5) + '...' + text.substring(text.length - 5)
  }

  return <Value>{result}</Value>
}
