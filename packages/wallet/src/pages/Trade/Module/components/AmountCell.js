import React from 'react'
import Amount from '../../../../components/Amount'
import styled from 'styled-components'
import BaseCell from './BaseCell'

const Cell = styled(BaseCell)`
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 16px;
`

export default function({ value, precision = 0 }) {
  return (
    <Cell>
      <Amount value={value} precision={precision} />
    </Cell>
  )
}
