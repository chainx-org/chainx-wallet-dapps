import React from 'react'
import { useSelector } from 'react-redux'
import { SelectInput } from '@chainx/ui'
import { intentionsSelector } from '../../../reducers/intentionSlice'

export default function({
  value,
  onChange,
  style,
  placeholder = '',
  error,
  errorText
}) {
  const intentions = useSelector(intentionsSelector)
  const intentionNames = intentions.map(intention => intention.name)
  const channelOptions = intentionNames.map(name => ({
    value: name,
    label: name
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
