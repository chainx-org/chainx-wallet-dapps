import styled from 'styled-components'
import { Dialog } from '@chainx/ui'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 0 16px 16px;
    & > div {
      margin-top: 10px;
      span.read {
        opacity: 0.72;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0.12px;
        line-height: 20px;
      }
      a {
        text-decoration: none;
        font-size: 14px;
        color: #0088cc;
        letter-spacing: 0.12px;
        line-height: 20px;
      }
    }
    & > p {
      display: flex;
      align-items: center;
      margin-top: 16px;
      &.info {
        opacity: 0.56;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;

        span {
          margin-left: 6px;
        }
      }
    }
  }
`

export default StyledDialog
