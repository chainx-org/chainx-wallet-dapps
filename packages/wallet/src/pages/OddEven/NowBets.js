import { useSelector } from 'react-redux'
import { betsSelector } from '../../reducers/oddevenSlice'
import styled from 'styled-components'
import React from 'react'

const Wrapper = styled.div`
  margin-top: 20px;
  width: 408px;
  div.chart {
    display: flex;
    justify-content: space-between;
    span {
      display: inline-flex;
      height: 10px;

      &.odd {
        background: #e05300;
        border-radius: 40px 0 0 40px;
      }

      &.even {
        background: #0086dc;
        border-radius: 0 100px 100px 0;
      }
    }
  }

  div.detail {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;

    span {
      opacity: 0.72;
      font-size: 12px;
      color: #000000;
      letter-spacing: 0.09px;
      text-align: right;
      line-height: 16px;
    }
  }
`

export default function() {
  const { odd, even } = useSelector(betsSelector)
  const sum = odd + even

  return (
    <Wrapper>
      <div className="chart">
        <span
          className="odd"
          style={{ width: `calc(${(odd / sum) * 100}% - 2px)` }}
        />
        <span
          className="even"
          style={{ width: `calc(${(even / sum) * 100}% - 2px)` }}
        />
      </div>
      <div className="detail">
        <span>{odd} PCX</span>
        <span>{even} PCX</span>
      </div>
    </Wrapper>
  )
}
