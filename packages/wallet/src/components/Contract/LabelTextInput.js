import React from 'react'
import styled from 'styled-components'
import { TextInput } from '@chainx/ui'

const InputWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  color: #000000;
  .label {
    height: 36px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
`

export default function({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  errMsg = ''
}) {
  return (
    <InputWithLabel>
      {label && <span className="label">{label}</span>}
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={!!errMsg}
        errorText={errMsg}
        showClear={false}
      />
    </InputWithLabel>
  )
}
