import React, { useState } from 'react'
import Wrapper, { Header } from './Wrapper'
import { useSelector } from 'react-redux'
import { currenciesSelector } from './selectors'

export default function() {
  const currencies = useSelector(currenciesSelector)

  const [activeCurrencyIndex, setActiveCurrencyIndex] = useState(0)

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
    </Wrapper>
  )
}
