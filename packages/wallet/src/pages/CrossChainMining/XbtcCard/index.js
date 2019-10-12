import React from 'react'
import Logo from '../components/Logo'
import icon from '../../../static/xbtc.svg'
import CardWrapper from '../components/CardWrapper'
import { useSelector } from 'react-redux'
import { normalizedXbtcSelector } from '../selectors'
import $t from '../../../locale'

export default function() {
  const xbtc = useSelector(normalizedXbtcSelector)

  const header = <Logo icon={icon} name={'X-BTC'} />
  const details = (
    <ul>
      <li>
        <header>{$t('PSEDU_CIRCULATION')}</header>
        <p>{xbtc.circulation}</p>
      </li>
      <li>
        <header>{$t('PSEDU_POWER')}（PCX）</header>
        <p>{xbtc.power}</p>
      </li>
      <li>
        <header>{$t('PSEDU_EQUIVALENT')}（PCX）</header>
        <p>{xbtc.vote}</p>
      </li>
      <li>
        <header>{$t('PSEDU_JACKPOT')}（PCX）</header>
        <p>{xbtc.jackpot}</p>
      </li>
      <li>
        <header>{$t('PSEDU_BALANCE')}</header>
        <p>{xbtc.balance}</p>
      </li>
    </ul>
  )

  return <CardWrapper header={header} detail={details}></CardWrapper>
}
