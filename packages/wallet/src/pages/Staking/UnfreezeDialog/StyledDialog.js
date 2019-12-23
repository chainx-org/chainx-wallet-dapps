import styled from 'styled-components'
import { Dialog } from '@chainx/ui'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px 0;
    & > div:not(:first-of-type) {
      margin-top: 16px;
    }

    table {
      width: 100%;
      font-size: 12px;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 16px;
      th,
      td {
        text-align: left;
      }
      th {
        font-weight: normal;
        opacity: 0.32;
      }
      thead td {
        padding-bottom: 5px;
      }
      tbody td {
        border-top: 1px solid #eeeeee;
        padding: 8px 0;
      }
    }
  }
`

export default StyledDialog
