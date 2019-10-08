import React from 'react'
import Logo from '../components/Logo'
import icon from '../../../staic/lbtc.svg'
import CardWrapper from '../components/CardWrapper'
import { normalizedLbtcSelector } from '../selectors'
import { useSelector } from 'react-redux'

export default function() {
  const lbtc = useSelector(normalizedLbtcSelector)

  const header = <Logo icon={icon} name={'L-BTC'} />
  const detail = (
    <ul>
      <li>
        <header>全链总余额</header>
        <p>{lbtc.circulation}</p>
      </li>
      <li>
        <header>挖矿算力（PCX）</header>
        <p>{lbtc.power}</p>
      </li>
      <li>
        <header>折合投票数（PCX）</header>
        <p>{lbtc.vote}</p>
      </li>
      <li>
        <header>奖池金额（PCX）</header>
        <p>{lbtc.jackpot}</p>
      </li>
    </ul>
  )

  return <CardWrapper header={header} detail={detail} />
}
