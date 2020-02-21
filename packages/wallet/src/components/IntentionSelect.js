import React from 'react'
import { intentionsSelector } from '../reducers/intentionSlice'
import { useSelector } from 'react-redux'
import { SelectInput } from '@chainx/ui'

export default function({ value, onChange, style, placeholder = '' }) {
  const intentions = useSelector(intentionsSelector)
  const filteredIntentions = intentions.filter(intention =>
    intention.name.toLowerCase().includes(value)
  )
  const intentionNames = filteredIntentions.map(intention => intention.name)
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
    />
  )
}
