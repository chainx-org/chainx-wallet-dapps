import styled from 'styled-components'
import { Dialog } from '@chainx/ui'

export const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;

    div.amount {
      p {
        font-size: 14px;
        color: #000000;
        letter-spacing: 0.12px;
        line-height: 16px;
        margin-bottom: 6px;

        span:first-of-type {
          opacity: 0.72;
        }
        span:last-of-type {
          opacity: 0.32;
        }
      }

      div.input {
        display: flex;
        align-items: center;

        & > div {
          flex: 1;
          &:last-of-type {
            margin-left: 16px;
          }
        }
      }
    }

    div.addr {
      margin-top: 16px;
      p {
        opacity: 0.72;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0.12px;
        line-height: 16px;
        margin-bottom: 8px;
      }
    }

    div.operation {
      margin-top: 20px;
    }
  }
`
