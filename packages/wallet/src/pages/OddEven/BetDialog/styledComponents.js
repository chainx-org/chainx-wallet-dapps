import styled, { css } from 'styled-components'
import { Dialog } from '@chainx/ui'

export const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;

    p {
      opacity: 0.72;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 16px;
      margin-bottom: 8px;
      &.others {
        margin-top: 16px;
      }
    }

    ol,
    li {
      margin: 0;
      padding: 0;
    }

    ol {
      width: 480px;
    }

    li {
      display: inline-flex;
      margin-top: 8px;
      &:nth-of-type(4n + 2),
      &:nth-of-type(4n + 3),
      &:nth-of-type(4n + 4) {
        margin-left: 16px;
      }
    }

    div.amount {
      display: flex;
      align-items: center;
      & > div {
        width: 50%;
        &:last-of-type {
          padding-left: 16px;
        }
      }
    }

    div.buttons-line {
      margin-top: 20px;
    }
  }
`

export const BetAmount = styled.span`
  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 6px;
  cursor: pointer;

  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  width: 105px;
  height: 48px;

  font-size: 14px;
  color: rgba(0, 0, 0, 0.72);
  letter-spacing: 0.12px;
  text-align: center;
  line-height: 20px;

  ${props =>
    props.active &&
    css`
      background: #f6c94a;
      border: 1px solid #f6c94a;
    `}
`
