import styled from 'styled-components'
import { Dialog } from '@chainx/ui'

export default styled(Dialog)`
  main.content {
    padding: 0 16px 20px;
    & > div {
      margin-top: 16px;
      &.amount {
        display: flex;
        align-items: center;

        & > div:first-of-type {
          width: 50%;
        }

        & > div:last-of-type {
          margin-left: 16px;
        }
      }

      &.warning {
        display: flex;
        div.left {
          width: 50%;
        }

        div p {
          display: flex;
          align-items: center;
          margin-top: 6px;

          span {
            margin-left: 4px;
            opacity: 0.56;
            font-size: 12px;
            color: #000000;
            letter-spacing: 0.2px;
            line-height: 16px;
          }
        }
      }

      &.fee {
        margin: 16px -16px 0;
        padding: 10px 16px;
        background: #f2f3f4;
        h3 {
          margin: 0;
          display: flex;
          justify-content: space-between;
          opacity: 0.32;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0.12px;
          line-height: 20px;
        }
        p {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          opacity: 0.72;
          font-size: 14px;
          font-weight: 500;
          color: #000000;
          letter-spacing: 0.12px;
          line-height: 20px;
        }
      }
    }
  }
`
