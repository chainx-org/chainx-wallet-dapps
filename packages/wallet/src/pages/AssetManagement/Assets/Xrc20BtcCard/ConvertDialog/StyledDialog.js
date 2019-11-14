import styled from 'styled-components'
import { Dialog } from '@chainx/ui'

export default styled(Dialog)`
  main.content {
    padding: 0 16px 20px;

    div.label {
      display: flex;
      margin-top: 20px;
      & > div {
        flex: 1;
        opacity: 0.72;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0.12px;
        line-height: 20px;

        &.from {
          margin-left: 3px;
        }
        &.to {
          margin-left: 16px;
        }
      }
    }
    div.input {
      display: flex;
      margin-top: 8px;
      & > div {
        flex: 1;
        &.from {
          margin-right: 16px;
        }
      }
    }

    div.amount {
      margin-top: 16px;
      display: flex;
      align-items: center;
      & > div {
        flex: 1;
        &.amount-input {
          margin-right: 8px;
        }
        &.balance {
          margin-left: 8px;
        }
      }
    }

    & > div:last-of-type {
      margin-top: 16px;
    }
  }
`
