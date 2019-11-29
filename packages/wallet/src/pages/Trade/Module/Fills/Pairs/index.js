import React, { useState } from 'react'
import Wrapper, { Cell, Header, PriceCell, SymbolCell } from './Wrapper'
import { useSelector } from 'react-redux'
import { currenciesSelector } from './selectors'
import { Table, TableBody, TableHead, TableRow } from '@chainx/ui'
import { pairsSelector } from '../../../../../reducers/tradeSlice'
import { toPrecision } from '../../../../../utils'

export default function() {
  const currencies = useSelector(currenciesSelector)
  const pairs = useSelector(pairsSelector)

  const [activeCurrencyIndex, setActiveCurrencyIndex] = useState(0)
  const nowCurrency = currencies[activeCurrencyIndex]
  const targetPairs = pairs.filter(pair => pair.currency === nowCurrency)

  return (
    <Wrapper>
      <Header>
        <ul>
          {currencies.map((currency, index) => {
            return (
              <li
                key={index}
                onClick={() => setActiveCurrencyIndex(index)}
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
            <Cell>币种</Cell>
            <Cell style={{ textAlign: 'right' }}>价格</Cell>
          </TableRow>
        </TableHead>
        <TableBody>
          {targetPairs.map((pair, index) => {
            const precision = pair.precision
            const showPrecision = precision - pair.unitPrecision
            return (
              <TableRow key={index}>
                <SymbolCell>{pair.assets}</SymbolCell>
                <PriceCell>
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
