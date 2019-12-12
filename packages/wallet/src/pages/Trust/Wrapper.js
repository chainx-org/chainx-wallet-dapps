import styled from 'styled-components'
import { TableCell } from '@chainx/ui'

export const BaseCell = styled(TableCell)`
  opacity: 0.72;
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 16px;
  font-size: 12px !important;
`

export const HeadCell = styled(BaseCell)`
  font-weight: 600 !important;
`

export const StatusHeadCell = styled(HeadCell)`
  text-align: right !important;
`

export const RightAlignCell = styled(TableCell)`
  text-align: right !important;
`

export const AmountCell = styled(BaseCell)`
  font-weight: 600 !important;
`

export const IndexCell = styled(BaseCell)`
  opacity: 1;
  font-weight: 600 !important;
  color: #46aee2 !important;
`
