import React from 'react'
import styled from 'styled-components'

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
  input {
    background: #ffffff;
    border: 1px solid #dce0e2;
    border-radius: 6px;
    width: 446px;
    height: 20px;
    font-size: 14px;
    padding: 10px;
    :disabled {
      background: #f2f3f4;
    }
    ::placeholder {
      opacity: 0.24;
    }
  }
  .error-msg {
    margin-top: 8px;
    font-size: 12px;
    color: #de071c;
  }
`

export default function({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  onBlur,
  errMsg = ''
}) {
  return (
    <InputWithLabel>
      {label && <span className="label">{label}</span>}
      <input
        className="not-draggable"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        type={type}
      />
      {errMsg && <span className="error-msg">{errMsg}</span>}
    </InputWithLabel>
  )
}
