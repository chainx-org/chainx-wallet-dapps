import React from 'react'
import Logo from '../components/Logo'
import icon from '../../../staic/xbtc.svg'
import CardWrapper from '../components/CardWrapper'
import { useSelector } from 'react-redux'
import { normalizedXbtcSelector } from '../selectors'

export default function() {
  const xbtc = useSelector(normalizedXbtcSelector)

  const header = <Logo icon={icon} name={'X-BTC'} />
  const details = (
    <ul>
      <li>
        <header>全链总余额</header>
        <p>{xbtc.circulation}</p>
      </li>
      <li>
        <header>挖矿算力（PCX）</header>
        <p>{xbtc.power}</p>
      </li>
      <li>
        <header>折合投票数（PCX）</header>
        <p>{xbtc.vote}</p>
      </li>
      <li>
        <header>奖池金额（PCX）</header>
        <p>{xbtc.jackpot}</p>
      </li>
      <li>
        <header>我的总余额</header>
        <p>{xbtc.balance}</p>
      </li>
    </ul>
  )

  return <CardWrapper header={header} detail={details}></CardWrapper>
}
