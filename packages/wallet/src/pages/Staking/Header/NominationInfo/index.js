import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  nominationRateSelector,
  normalizedTotalNominationSelector
} from '../../selectors'
import nominationIcon from './nomination.svg'
import rateIcon from './nomination_rate.svg'
import ReactTooltip from 'react-tooltip'

const Info = styled.ul`
  display: inline-flex;
  flex-direction: column;
  padding-right: 24px;

  li {
    display: inline-flex;
    align-items: center;

    font-size: 12px;
    color: #000000;
    line-height: 16px;

    span {
      opacity: 0.72;
    }

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
    <>
      <Info>
        <li data-tip="投票总数">
          <img src={nominationIcon} alt="total nomination" />
          <span>{totalNomination}</span>
        </li>
        <li data-tip="投票率">
          <img src={rateIcon} alt="nomination rate" />
          <span>{nominationRate}</span>
        </li>
      </Info>
      <ReactTooltip place="bottom" type="dark" effect="solid" />
    </>
  )
}
