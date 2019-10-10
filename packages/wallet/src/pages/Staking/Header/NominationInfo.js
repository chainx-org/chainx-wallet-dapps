import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { totalNominationSelector } from '../selectors'
import nominationLogo from './nomination.svg'

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
  }
`

export default function() {
  const totalNomination = useSelector(totalNominationSelector)

  return (
    <Info>
      <li>
        <img src={nominationLogo} alt="total nomination" />
        {totalNomination}
      </li>
    </Info>
  )
}
