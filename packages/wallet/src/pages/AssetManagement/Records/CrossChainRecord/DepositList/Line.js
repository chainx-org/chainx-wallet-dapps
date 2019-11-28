import React, { useRef, useState } from 'react'
import moment from 'moment'
import { timeFormat } from '../../../../../utils/constants'
import { toPrecision } from '../../../../../utils'
import { useSelector } from 'react-redux'
import { xbtcPrecisionSelector } from '../../../../selectors/assets'
import Detail from '../../components/Detail'
import Label from '../../components/Label'
import BtcTx from '../../components/BtcTx'
import $t from '../../../../../locale'
import BtcAddress from '../../components/BtcAddress'
import useOutsideClick from '../../../../../utils/useClickOutside'
import getState from './State'

export default function({ deposit }) {
  const precision = useSelector(xbtcPrecisionSelector)
  const [open, setOpen] = useState(false)

  const wrapper = useRef(null)
  useOutsideClick(wrapper, () => {
    setOpen(false)
  })

  return (
    <li onClick={() => setOpen(!open)} ref={wrapper}>
      <header>
        <span>X-BTC</span>
        <span>{moment(deposit['block.time']).format(timeFormat)}</span>
      </header>
      <main>
        <span>{toPrecision(deposit.balance, precision)}</span>
        <span>{getState(deposit.txstate)}</span>
      </main>
      {open ? (
        <Detail>
          <li>
            <Label>{$t('ASSET_ORIGIN_TX_ID')}</Label>
            <BtcTx hash={deposit.txid} />
          </li>
          <li>
            <Label>{$t('COMMON_ADDRESS')}</Label>
            <BtcAddress address={deposit.address} />
          </li>
        </Detail>
      ) : null}
    </li>
  )
}
