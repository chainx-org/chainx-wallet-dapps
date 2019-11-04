import styled from 'styled-components'
import { toPrecision } from '../../../utils'
import { PrimaryButton } from '@chainx/ui'
import React from 'react'

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  label {
    opacity: 0.32;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.2px;
    line-height: 16px;
    margin-right: 8px;
  }
  span {
    opacity: 0.72;
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 24px;
    min-width: 200px;
  }
  button {
    width: 84px;
    span {
      width: 84px !important;
      font-size: 14px !important;
    }
  }
`

export default function(props) {
  const { interest, precision, claim, token, disabled } = props

  return (
    <Wrapper>
      <label>代提利息</label>
      <span>{toPrecision(interest, precision)} PCX</span>
      <PrimaryButton
        disabled={disabled}
        size="small"
        onClick={() => claim(token)}
      >
        提息
      </PrimaryButton>
    </Wrapper>
  )
}
