import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  nominationRateSelector,
  normalizedTotalNominationSelector
} from '../../selectors'
import nominationIcon from './nomination.svg'
import rateIcon from './nomination_rate.svg'

const Info = styled.ul`
  display: inline-flex;
  flex-direction: column;

  li {
    display: inline-flex;
    align-items: center;

    opacity: 0.72;
    font-size: 12px;
    color: #000000;
    line-height: 16px;

    img {
      margin-right: 7px;
    }

    &:last-of-type {
      margin-top: 4px;
    }
  }
`

export default function() {
  const totalNomination = useSelector(normalizedTotalNominationSelector)
  const nominationRate = useSelector(nominationRateSelector)

  return (
    <Info>
      <li>
        <img src={nominationIcon} alt="total nomination" />
        {totalNomination}
      </li>
      <li>
        <img src={rateIcon} alt="nomination rate" />
        {nominationRate}
      </li>
    </Info>
  )
}
