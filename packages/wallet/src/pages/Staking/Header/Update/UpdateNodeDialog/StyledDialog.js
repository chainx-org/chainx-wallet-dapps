import styled from 'styled-components'
import { Dialog } from '@chainx/ui'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;
    & > ul {
      margin: 0 -16px;
      padding: 10px 16px;
      background: #f2f3f4;
      & > li {
        display: flex;
        justify-content: space-between;

        span {
          margin-left: 30px;
        }
      }
    }

    & > div {
      margin-top: 10px;
      p {
        opacity: 0.72;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0.12px;
        line-height: 20px;
        margin-bottom: 8px;
      }

      &.confirm {
        margin-top: 16px;
      }
    }
  }
`

export default StyledDialog
