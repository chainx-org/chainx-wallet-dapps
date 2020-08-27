import React from 'react'
import { useSelector } from 'react-redux'
import { SelectInput } from '@chainx/ui'
import { validatorsSelector } from '@reducers/validatorSlice'

export default function({
  value,
  onChange,
  style,
  placeholder = '',
  error,
  errorText
}) {
  const validators = useSelector(validatorsSelector)
  const accounts = validators.map(v => v.account)
  const channelOptions = accounts.map(account => ({
    value: account,
    label: account
  }))

  return (
    <SelectInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      options={channelOptions}
      error={error}
      errorText={errorText}
    />
  )
}
