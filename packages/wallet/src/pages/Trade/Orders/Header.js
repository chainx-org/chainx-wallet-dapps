import React from 'react'
import { Header } from './Wrapper'

export default function({ idx, setIdx }) {
  return (
    <Header>
      <ul>
        <li className={idx === 0 ? 'active' : null} onClick={() => setIdx(0)}>
          当前委托
        </li>
        <li className={idx === 1 ? 'active' : null} onClick={() => setIdx(1)}>
          历史委托
        </li>
      </ul>
    </Header>
  )
}
