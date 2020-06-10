import React from 'react'

export default function({ addr }) {
  const prefix = addr.slice(0, 5)
  const suffix = addr.slice(addr.length - 5)

  return <span title={addr}>{`${prefix}...${suffix}`}</span>
}
