import { Dialog } from '@chainx/ui'
import styled from 'styled-components'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;
    p {
      &:first-of-type {
        opacity: 0.72;
      }
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;

      &:last-of-type {
        margin-top: 16px;
        a {
          text-decoration: none;
          font-size: 14px;
          color: #003a00;
          letter-spacing: 0.12px;
          line-height: 16px;
        }
      }
    }

    div.buttons {
      display: flex;
      flex-direction: row-reverse;
      margin-top: 20px;

      & > button:last-of-type {
        margin-right: 16px;
      }
    }
  }
`

export default StyledDialog
