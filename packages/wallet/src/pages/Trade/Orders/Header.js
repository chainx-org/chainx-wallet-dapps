import React from 'react'
import { Header } from './Wrapper'
import $t from '../../../locale'

export default function({ idx, setIdx }) {
  return (
    <Header>
      <ul>
        <li className={idx === 0 ? 'active' : null} onClick={() => setIdx(0)}>
          {$t('TRADE_OPEN_ORDERS')}
        </li>
        <li className={idx === 1 ? 'active' : null} onClick={() => setIdx(1)}>
          {$t('TRADE_HISTORY_ORDERS')}
        </li>
      </ul>
    </Header>
  )
}
