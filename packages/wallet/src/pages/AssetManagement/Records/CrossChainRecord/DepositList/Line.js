import React from 'react'
import moment from 'moment'
import { timeFormat } from '../../../../../utils/constants'
import { toPrecision } from '../../../../../utils'
import { useSelector } from 'react-redux'
import { xbtcPrecisionSelector } from '../../../../selectors/assets'

export default function({ deposit }) {
  const precision = useSelector(xbtcPrecisionSelector)

  return (
    <li>
      <header>
        <span>X-BTC</span>
        <span>{moment(deposit['block.time']).format(timeFormat)}</span>
      </header>
      <main>
        <span>{toPrecision(deposit.balance, precision)}</span>
        <span>{deposit.txstate}</span>
      </main>
    </li>
  )
}
