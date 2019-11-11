import styled from 'styled-components'
import { Dialog } from '@chainx/ui'

export default styled(Dialog)`
  main.content {
    padding: 0 16px 20px;
    & > div {
      margin-top: 16px;
      &.intention {
        display: flex;
        justify-content: space-between;
        & > div {
          width: 50%;
        }
      }

      &.info {
        display: flex;
        justify-content: space-between;
        margin: 16px -16px 0;
        padding: 10px 16px;
        background: #f2f3f4;
        h4 {
          margin: 0;
          opacity: 0.32;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0.12px;
          line-height: 20px;
        }
        p {
          margin-top: 4px;
          opacity: 0.72;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0.12px;
          line-height: 20px;
        }

        & > section {
          width: 40%;
          &:last-of-type {
            text-align: right;
          }
        }
      }
    }
  }
`
