import styled from 'styled-components'
import { TableCell } from '@chainx/ui'

export const BaseCell = styled(TableCell)`
  font-size: 12px !important;
  letter-spacing: 0.2px;
  line-height: 16px !important;
  color: #000000;
`

export const TimeCell = styled(BaseCell)`
  padding: 0 !important;
  & > div {
    display: flex;
    align-items: center;
  }
  span.time {
    opacity: 0.32 !important;
    margin-left: 9px;
  }
  span.Sell {
    display: inline-block;
    width: 6px;
    height: 40px;
    background: #ea754b;
    border-radius: 3px;
  }

  span.Buy {
    display: inline-block;
    width: 6px;
    height: 40px;
    background: #34c69a;
    border-radius: 3px;
  }
`

export const IndexCell = styled(BaseCell)`
  color: #0088cc !important;
`

export const PairCell = styled(BaseCell)`
  opacity: 0.72 !important;
`

export const NumberCell = styled(BaseCell)`
  opacity: 0.72 !important;
  font-weight: 600 !important;
  span {
    font-weight: normal !important;
    color: #afb1b4;
  }
`

export const FillCell = styled(BaseCell)`
  &.zero {
    span.amount {
      opacity: 0.32 !important;
    }
    span.percentage {
      opacity: 0.3 !important;
      font-weight: 600;
    }
  }

  &.Sell {
    font-weight: 600;
    color: #dc6e46 !important;
    span.percentage {
      color: #3f3f3f;
    }
  }

  &.Buy {
    font-weight: 600;
    color: #dc6e46 !important;
    span.percentage {
      color: #2caa84;
    }
  }
`

export const ActionCell = styled(TableCell)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  text-align: right !important;
  & > img.cancel {
    cursor: pointer;
  }
`
