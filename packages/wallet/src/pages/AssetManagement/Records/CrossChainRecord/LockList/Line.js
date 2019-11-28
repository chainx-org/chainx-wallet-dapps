import React, { useRef, useState } from 'react'
import moment from 'moment'
import { timeFormat } from '../../../../../utils/constants'
import { toPrecision } from '../../../../../utils'
import { useSelector } from 'react-redux'
import { lbtcPrecisionSelector } from '../../../../selectors/assets'
import Detail from '../../components/Detail'
import $t from '../../../../../locale'
import BtcTx from '../../components/BtcTx'
import Label from '../../components/Label'
import BtcAddress from '../../components/BtcAddress'
import useOutsideClick from '../../../../../utils/useClickOutside'

export default function({ lock }) {
  const precision = useSelector(lbtcPrecisionSelector)
  const [open, setOpen] = useState(false)

  const wrapper = useRef(null)
  useOutsideClick(wrapper, () => {
    setOpen(false)
  })

  return (
    <li onClick={() => setOpen(!open)} ref={wrapper}>
      <header>
        <span>L-BTC</span>
        <span>{moment(lock.lock_time).format(timeFormat)}</span>
      </header>
      <main>
        <span>
          {lock.type === 0 ? '+' : '-'}
          {toPrecision(lock.value, precision)}
        </span>
        <span>{lock.type === 0 ? '锁仓' : '解锁'}</span>
      </main>
      {open ? (
        <Detail>
          <li>
            <Label>{$t('ASSET_ORIGIN_TX_ID')}</Label>
            <BtcTx hash={lock.hash} />
          </li>
          <li>
            <Label>{$t('COMMON_ADDRESS')}</Label>
            <BtcAddress address={lock.address} />
          </li>
        </Detail>
      ) : null}
    </li>
  )
}
