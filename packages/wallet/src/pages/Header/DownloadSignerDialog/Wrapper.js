import { Dialog } from '@chainx/ui'
import styled from 'styled-components'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;
    p {
      opacity: 0.56;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;
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
