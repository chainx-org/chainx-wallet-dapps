import { Header } from './styledComponents'
import Logo from './odd-even-logo.svg'
import $t from '../../locale'
import BtcHash from './components/BtcHash'
import React from 'react'
import { useSelector } from 'react-redux'
import { nowBtcSelector } from '../../reducers/oddevenSlice'

export default function() {
  const btc = useSelector(nowBtcSelector)

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
    </Header>
  )
}
