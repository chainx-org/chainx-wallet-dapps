import { Header } from './styledComponents'
import Logo from './odd-even-logo.svg'
import $t from '../../locale'
import BtcHash from './components/BtcHash'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { nowBtcSelector } from '../../reducers/oddevenSlice'
import Balance from './Balance'
import DepositAndWithdraw from './DepositAndWithdraw'
import RecordsImg from './assets/records.svg'
import styled from 'styled-components'
import WithdrawRecords from './WithdrawRecords'
import useOutsideClick from '../../utils/useClickOutside'

const RecordsWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-left: 1px solid #eeeeee;
  margin-left: 16px;

  cursor: pointer;
`

export default function({ withdraw, deposit }) {
  const btc = useSelector(nowBtcSelector)
  const [openWithdrawRecords, setOpenWithdrawRecords] = useState(false)

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    setOpenWithdrawRecords(false)
  })

  return (
    <Header>
      <div>
        <img src={Logo} alt="logo" />
        <dl>
          <dt>{$t('PREDICT_NOW_BTC_HEIGHT')}</dt>
          <dd>{btc.height}</dd>
          <dt>{$t('PREDICT_NOW_BTC_HASH')}</dt>
          <dd>
            <BtcHash>{btc.hash}</BtcHash>
          </dd>
        </dl>
      </div>
      <div className="right" ref={popup}>
        <Balance />
        <DepositAndWithdraw withdraw={withdraw} deposit={deposit} />
        <RecordsWrapper
          onClick={() => setOpenWithdrawRecords(!openWithdrawRecords)}
        >
          <img src={RecordsImg} alt="withdraw records" />
        </RecordsWrapper>
        {openWithdrawRecords && <WithdrawRecords />}
      </div>
    </Header>
  )
}
