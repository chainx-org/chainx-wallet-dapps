import React from 'react'
import {
  EvenPanel,
  OddPanel,
  Wrapper,
  OddBadge,
  EvenBadge
} from './styledComponents'
import { useSelector } from 'react-redux'
import {
  evenRankingSelector,
  oddRankingSelector
} from '../../../reducers/oddevenSlice'
import $t from '../../../locale'
import { Empty } from '../../../components'
import ShortAddress from './ShortAddress'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { toPrecision } from '../../../utils'

export default function() {
  const oddRankingList = useSelector(oddRankingSelector)
  const evenRankingList = useSelector(evenRankingSelector)
  const precision = useSelector(pcxPrecisionSelector)

  return (
    <Wrapper>
      <OddPanel>
        <header>
          <span>奇数投注</span>
          <OddBadge>
            <span>{oddRankingList.length}</span>
          </OddBadge>
        </header>
        <div>
          {oddRankingList.length <= 0 && (
            <Empty style={{ marginTop: 20 }} text={$t('PREDICT_NO_BETS')} />
          )}
          {oddRankingList.length > 0 && (
            <ol>
              {oddRankingList.map((item, idx) => (
                <li key={idx}>
                  <span>{toPrecision(item.bet_balance, precision)} PCX</span>
                  <ShortAddress addr={item.player} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </OddPanel>
      <EvenPanel>
        <header>
          <span>偶数投注</span>
          <EvenBadge>
            <span>{evenRankingList.length}</span>
          </EvenBadge>
        </header>
        <div>
          {evenRankingList.length <= 0 && (
            <Empty style={{ marginTop: 20 }} text={$t('PREDICT_NO_BETS')} />
          )}
          {evenRankingList.length > 0 && (
            <ol>
              {evenRankingList.map((item, idx) => (
                <li key={idx}>
                  <span>{toPrecision(item.bet_balance, precision)} PCX</span>
                  <ShortAddress addr={item.player} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </EvenPanel>
    </Wrapper>
  )
}
