import React, { memo } from 'react'

export default memo(function NumberFormat(props) {
  const { component: Component = 'span', value, options, ...other } = props
  if (isNaN(value)) return ''

  return (
    <Component {...other}>
      {new Intl.NumberFormat(undefined, {
        useGrouping: true,
        ...options
      }).format(value)}
    </Component>
  )
})
