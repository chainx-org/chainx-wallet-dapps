import React, { useState } from 'react'
import moreIcon from './more.svg'
import styled from 'styled-components'
import UnNominateDialog from '../../../UnNominateDialog'

const Wrapper = styled.div`
  display: inline-flex;
  position: relative;
  z-index: 1;
  img {
    cursor: pointer;
  }

  ul {
    display: none;
    &.show {
      display: flex;
    }
    flex-direction: column;
    width: 116px;
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
  const [unNominateOpen, setUnNominateOpen] = useState(false)

  const { nomination } = record.info || {}

  return (
    <Wrapper>
      <img src={moreIcon} alt="more" onClick={() => setShowMore(!showMore)} />
      <ul className={showMore ? 'show' : 'hide'}>
        <li
          onClick={() => {
            setUnNominateOpen(true)
            setShowMore(false)
          }}
        >
          赎回投票
        </li>
        <li>切换投票</li>
      </ul>
      {unNominateOpen ? (
        <UnNominateDialog
          intention={intention}
          nomination={nomination}
          handleClose={() => setUnNominateOpen(false)}
        />
      ) : null}
    </Wrapper>
  )
}
