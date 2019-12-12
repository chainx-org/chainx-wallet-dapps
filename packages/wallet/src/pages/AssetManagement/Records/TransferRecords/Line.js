import React, { useRef, useState } from 'react'
import useOutsideClick from '../../../../utils/useClickOutside'
import { useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import { ensure0xPrefix, remove0xPrefix } from '../../../../utils'
import { Address, Hash } from '../../../../components'
import Detail from '../components/Detail'
import Label from '../components/Label'
import $t from '../../../../locale'

export default function({ transfer }) {
  const accountAddress = useSelector(addressSelector)
  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(accountAddress, false)
  const targetId =
    remove0xPrefix(accountId) === transfer.signed
      ? transfer.payee
      : transfer.signed
  let targetAddress = ''
  if (targetId) {
    targetAddress = chainx.account.encodeAddress(ensure0xPrefix(targetId))
  }

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
        <span>{transfer.value}</span>
        <span>{transfer.direction}</span>
      </main>
      {open ? (
        <Detail>
          <li>
            <Label>{$t('ASSET_WITHDRAWAL_TX_ID')}</Label>
            <Hash hash={transfer.hash} />
          </li>
          <li>
            <Label>{$t('COMMON_ADDRESS')}</Label>
            <Address address={targetAddress} />
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
