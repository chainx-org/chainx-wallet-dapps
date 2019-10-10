import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { blockTimeSelector, producerSelector } from '../selectors'
import { blockNumberSelector } from '../../../reducers/chainSlice'

const Wrapper = styled.ul`
  display: flex;
  font-size: 13px;
  color: #000000;
  line-height: 18px;

  li {
    label,
    span:not(.producer) {
      opacity: 0.72;
    }

    span {
      margin-left: 6px;
      &.producer {
        opacity: unset;
        color: #2caa84;
      }
    }
    &:last-of-type {
      margin-left: 16px;
    }
  }
`

export default function() {
  const blockTime = useSelector(blockTimeSelector)
  const blockNumber = useSelector(blockNumberSelector)
  const producer = useSelector(producerSelector)

  return (
    <Wrapper>
      <li>
        <label>出块时间</label>
        <span>{blockTime}</span>
      </li>
      <li>
        <label>最新高度</label>
        <span>{blockNumber}</span>
        <span className="producer">{producer}</span>
      </li>
    </Wrapper>
  )
}
