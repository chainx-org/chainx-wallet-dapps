import React, { useState } from 'react'
import Wrapper, { Header, SymbolCell } from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import { currenciesSelector } from './selectors'
import { Table, TableBody, TableHead, TableRow } from '@chainx/ui'
import {
  pairsSelector,
  setCurrentPair
} from '../../../../../reducers/tradeSlice'
import { toPrecision } from '../../../../../utils'
import HeadCell from '../../components/HeadCell'
import PriceCell from '../../components/PriceCell'

export default function() {
  const currencies = useSelector(currenciesSelector)
  const pairs = useSelector(pairsSelector)

  const [activeCurrencyIndex, setActiveCurrencyIndex] = useState(0)
  const nowCurrency = currencies[activeCurrencyIndex]
  const targetPairs = pairs.filter(pair => pair.currency === nowCurrency)

  const dispatch = useDispatch()

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

                  const currency = currencies[index]
                  const targetPairs = pairs.filter(
                    pair => pair.currency === currency
                  )
                  dispatch(setCurrentPair(targetPairs[index]))
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
            <HeadCell>币种</HeadCell>
            <HeadCell style={{ textAlign: 'right' }}>价格</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {targetPairs.map((pair, index) => {
            const precision = pair.precision
            const showPrecision = precision - pair.unitPrecision
            return (
              <TableRow key={index}>
                <SymbolCell>{pair.assets}</SymbolCell>
                <PriceCell style={{ textAlign: 'right' }}>
                  {Number(toPrecision(pair.lastPrice, precision)).toFixed(
                    showPrecision
                  )}
                </PriceCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Wrapper>
  )
}
