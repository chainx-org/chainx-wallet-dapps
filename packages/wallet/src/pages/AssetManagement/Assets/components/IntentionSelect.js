import React from 'react'
import { intentionsSelector } from '../../../../reducers/intentionSlice'
import { useSelector } from 'react-redux'
import { SelectInput } from '@chainx/ui'

export default function({ value, onChange, style }) {
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
      style={style}
      options={channelOptions}
    />
  )
}
