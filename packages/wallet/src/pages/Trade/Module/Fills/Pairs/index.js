import React, { useState } from 'react'
import Wrapper, { Header, SymbolCell } from './Wrapper'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableHead, TableRow } from '@chainx/ui'
import { toPrecision } from '../../../../../utils'
import HeadCell from '../../components/HeadCell'
import { PairPriceDownCell } from '../../components/PriceCell'
import $t from '../../../../../locale'
import { currentPairSelector } from '@reducers/dexSlice'
import {
  pairPipPrecisionSelector,
  pairPrecisionSelector
} from '@pages/Trade/Module/AskBid/dexSelectors'

export default function() {
  const currencies = ['XBTC']
  const [activeCurrencyIndex, setActiveCurrencyIndex] = useState(0)

  const pair = useSelector(currentPairSelector)
  const showPrecision = useSelector(pairPrecisionSelector)
  const pipPrecision = useSelector(pairPipPrecisionSelector)

  return (
    <Wrapper>
      <Header>
        <ul>
          {currencies.map((currency, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  setActiveCurrencyIndex(index)
                }}
                className={index === activeCurrencyIndex ? 'active' : null}
              >
                {currency}
              </li>
            )
          })}
        </ul>
      </Header>

      <Table>
        <TableHead>
          <TableRow>
            <HeadCell>{$t('TRADE_TOKEN')}</HeadCell>
            <HeadCell style={{ textAlign: 'right' }}>
              {$t('TRADE_PRICE')}
            </HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <SymbolCell>PCX</SymbolCell>
            {pair && (
              <PairPriceDownCell style={{ textAlign: 'right' }}>
                {Number(toPrecision(pair.latestPrice, pipPrecision)).toFixed(
                  showPrecision
                )}
              </PairPriceDownCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </Wrapper>
  )
}
