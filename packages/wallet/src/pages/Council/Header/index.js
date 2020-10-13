import React from 'react'
import { Header } from '../../Right/Wrapper'
import $t from '../../../locale'

export default function({ idx, setIdx }) {
  return (
    <Header>
      <ul>
        <li className={idx === 0 ? 'active' : null} onClick={() => setIdx(0)}>
          {$t('COUNCIL_OVERVIEW')}
        </li>
        {/* <li className={idx === 1 ? 'active' : null} onClick={() => setIdx(1)}>
          {$t('TRADE_HISTORY_ORDERS')}
        </li> */}
      </ul>
    </Header>
  )
}
