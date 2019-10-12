import React from 'react'
import Logo from '../components/Logo'
import icon from '../../../static/sdot.svg'
import CardWrapper from '../components/CardWrapper'
import { normalizedSdotSelector } from '../selectors'
import { useSelector } from 'react-redux'

export default function() {
  const sdot = useSelector(normalizedSdotSelector)
  const header = <Logo icon={icon} name={'S-DOT'} />
  const detail = (
    <ul>
      <li>
        <header>全链总余额</header>
        <p>{sdot.circulation}</p>
      </li>
      <li>
        <header>挖矿算力（PCX）</header>
        <p>{sdot.power}</p>
      </li>
      <li>
        <header>折合投票数（PCX）</header>
        <p>{sdot.vote}</p>
      </li>
      <li>
        <header>奖池金额（PCX）</header>
        <p>{sdot.jackpot}</p>
      </li>
      <li>
        <header>我的总余额</header>
        <p>{sdot.balance}</p>
      </li>
    </ul>
  )

  return <CardWrapper header={header} detail={detail} />
}
