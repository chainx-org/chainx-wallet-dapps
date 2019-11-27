import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import useOutsideClick from '../../../../utils/useClickOutside'
import { useSelector } from 'react-redux'
import { addressSelector } from '../../../../reducers/addressSlice'
import { getChainx } from '../../../../services/chainx'
import { ensure0xPrefix, remove0xPrefix } from '../../../../utils'
import { Address, Hash } from '../../../../components'

const Detail = styled.ul`
  position: absolute;
  width: 260px;
  padding: 16px;
  top: 58px;
  right: 2px;
  background: rgba(255, 255, 255);
  border: 1px solid #dce0e2;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  z-index: 9;
  & > li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:not(:first-of-type) {
      margin-top: 8px;
    }
    &.memo {
      align-items: flex-start;
    }
    p.memo {
      opacity: 0.56;
      font-size: 13px;
      color: #000000;
      letter-spacing: 0.2px;
      text-align: right;
      line-height: 18px;
    }
  }
`

const Label = styled.span`
  opacity: 0.32;
  font-size: 13px;
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 18px;
`

export default function({ transfer }) {
  const accountAddress = useSelector(addressSelector)
  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(accountAddress, false)
  const targetId =
    remove0xPrefix(accountId) === transfer.signed
      ? transfer.payee
      : transfer.signed
  const targetAddress = chainx.account.encodeAddress(ensure0xPrefix(targetId))

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
            <Label>交易ID</Label>
            <Hash hash={transfer.hash} />
          </li>
          <li>
            <Label>地址</Label>
            <Address address={targetAddress} />
          </li>
          <li className="memo">
            <Label>备注</Label>
            <p className="memo">{transfer.memo}</p>
          </li>
        </Detail>
      ) : null}
    </div>
  )
}
