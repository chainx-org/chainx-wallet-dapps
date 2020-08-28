import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import normalIcon from './normal.svg'
import openIcon from './open.svg'
import $t from '../../../../locale'
import useOutsideClick from '../../../../utils/useClickOutside'
import {
  loadingIntentionsSelector,
  switchNominationOpenSelector,
  unFreezeOpenSelector,
  unNominateOpenSelector,
  voteOpenSelector
} from '../../../../reducers/runStatusSlice'
import {
  totalInterestSelector,
  totalNominationSelector
} from '@reducers/validatorSlice'
import { locksSelector, pcxPrecisionSelector } from '@reducers/assetSlice'
import { toPrecision } from '../../../../utils'
import NominationBoard from './NominationBoard'
import LoadingWithText from '@components/LoadingWithText'

const Wrapper = styled.div`
  display: flex;

  position: relative;
  & > img {
    cursor: pointer;
    margin-left: 8px;
  }
`

const Ul = styled.ul`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  cursor: pointer;

  & > li {
    display: inline-flex;
    flex-direction: column;
    min-width: 80px;

    & > label {
      opacity: 0.32;
      font-size: 12px;
      color: #000000;
      text-align: right;
      line-height: 16px;
    }
    & > span {
      display: inline-block;
      min-height: 20px;

      opacity: 0.72;
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 20px;
      text-align: right;
    }

    &:not(:first-of-type) {
      margin-left: 32px;
    }
  }
`

export default function() {
  const precision = useSelector(pcxPrecisionSelector)
  const totalNomination = useSelector(totalNominationSelector)
  const bondedWithdrawal = useSelector(locksSelector).BondedWithdrawal
  const totalInterest = useSelector(totalInterestSelector)
  const [open, setOpen] = useState(false)

  const voteOpen = useSelector(voteOpenSelector)
  const unNominateOpen = useSelector(unNominateOpenSelector)
  const switchNominationOpen = useSelector(switchNominationOpenSelector)
  const unFreezeOpen = useSelector(unFreezeOpenSelector)
  const loading = useSelector(loadingIntentionsSelector)

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    if (
      !unNominateOpen &&
      !switchNominationOpen &&
      !voteOpen &&
      !unFreezeOpen
    ) {
      setOpen(false)
    }
  })

  if (loading) {
    return <LoadingWithText text={$t('STAKING_LOADING_INTEREST')} />
  }

  return (
    <Wrapper ref={popup}>
      <Ul onClick={() => setOpen(!open)}>
        <li>
          <label>{$t('STAKING_REVOCATION')}</label>
          <span>{toPrecision(bondedWithdrawal, precision)}</span>
        </li>
        <li>
          <label>{$t('STAKING_MY_NOMINATION')}</label>
          <span>{toPrecision(totalNomination, precision)}</span>
        </li>
        <li>
          <label>{$t('STAKING_INTEREST')}</label>
          <span>{toPrecision(totalInterest, precision)}</span>
        </li>
      </Ul>
      <img
        src={open ? openIcon : normalIcon}
        alt="open"
        onClick={() => setOpen(!open)}
      />
      {open ? <NominationBoard close={() => setOpen(false)} /> : null}
    </Wrapper>
  )
}
