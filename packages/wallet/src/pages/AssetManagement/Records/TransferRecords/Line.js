import React, { useRef, useState } from 'react'
import useOutsideClick from '../../../../utils/useClickOutside'
import { Address, Hash } from '../../../../components'
import Detail from '../components/Detail'
import Label from '../components/Label'
import $t from '../../../../locale'
import { toPrecision } from '../../../../utils'

export default function({ transfer, currentAddress }) {
  const [open, setOpen] = useState(false)
  const wrapper = useRef(null)
  useOutsideClick(wrapper, () => {
    setOpen(false)
  })

  return (
    <div className="line" onClick={() => setOpen(!open)} ref={wrapper}>
      <header>
        <span>{transfer.token}</span>
        <span>{transfer.time}</span>
      </header>
      <main>
        <span>{toPrecision(transfer.value, 8)}</span>
        <span>
          {transfer.from === currentAddress
            ? $t('ASSET_TRANSFER_OUT')
            : $t('ASSET_TRANSFER_IN')}
        </span>
      </main>
      {open ? (
        <Detail>
          <li>
            <Label>{$t('ASSET_WITHDRAWAL_TX_ID')}</Label>
            <Hash hash={transfer.extrinsicHash} />
          </li>
          <li>
            <Label>{$t('COMMON_ADDRESS')}</Label>
            <Address address={transfer.to} />
          </li>
          <li className="memo">
            <Label>{$t('COMMON_MEMO_SHORT')}</Label>
            <p className="memo">{transfer.memo}</p>
          </li>
        </Detail>
      ) : null}
    </div>
  )
}
