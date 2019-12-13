import React, { useRef, useState } from 'react'
import moreIcon from './more.svg'
import styled from 'styled-components'
import UnNominateDialog from '../../../UnNominateDialog'
import $t from '../../../../../locale'
import useOutsideClick from '../../../../../utils/useClickOutside'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSwitchNominationData,
  setSwitchNominationOpen,
  setUnNominateOpen,
  unNominateOpenSelector
} from '../../../../../reducers/runStatusSlice'

const Wrapper = styled.div`
  display: inline-flex;
  position: relative;
  z-index: 1;
  img {
    cursor: pointer;
  }

  ul {
    width: 190px;
    display: none;
    &.show {
      display: flex;
    }
    flex-direction: column;
    position: absolute;
    top: 30px;
    right: 0;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #dce0e2;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    li {
      cursor: pointer;
      padding: 5px 0;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;
      text-align: center;
      &:hover {
        background: #f5f6f7;
      }
      &:first-of-type {
        border-bottom: 1px solid #eee;
      }
    }
  }
`

export default function({ intention, record = {} }) {
  const [showMore, setShowMore] = useState(false)
  const unNominateOpen = useSelector(unNominateOpenSelector)
  const dispatch = useDispatch()

  const { nomination, revocations = [] } = record.info || {}

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    if (showMore) {
      setShowMore(false)
    }
  })

  return (
    <Wrapper>
      <img src={moreIcon} alt="more" onClick={() => setShowMore(!showMore)} />
      <ul className={showMore ? 'show' : 'hide'} ref={popup}>
        <li
          onClick={() => {
            dispatch(setUnNominateOpen(true))
            setShowMore(false)
          }}
        >
          {$t('STAKING_UN_NOMINATION')}
        </li>
        <li
          onClick={() => {
            dispatch(
              setSwitchNominationData({
                intention,
                nomination
              })
            )
            dispatch(setSwitchNominationOpen(true))
            setShowMore(false)
          }}
        >
          {$t('STAKING_SWITCH_NOMINATION')}
        </li>
      </ul>
      {unNominateOpen ? (
        <UnNominateDialog
          intention={intention}
          nomination={nomination}
          revocations={revocations}
          handleClose={() => dispatch(setUnNominateOpen(false))}
        />
      ) : null}
    </Wrapper>
  )
}
