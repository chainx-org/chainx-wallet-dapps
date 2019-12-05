import React from 'react'
import { toPrecision } from '../../../../../../utils'
import _ from 'lodash'
import styled from 'styled-components'

const Wrapper = styled.div`
  opacity: 0.72;
  font-size: 13px;
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 18px;
`

export default function({ asset, free, precision }) {
  const validFree = !_.isNull(free) && !_.isUndefined(free)
  const validPrecision = !_.isNull(precision) && !_.isUndefined(precision)

  return (
    <Wrapper>
      <span>{asset}: </span>
      <span>{validFree && validPrecision && toPrecision(free, precision)}</span>
    </Wrapper>
  )
}
