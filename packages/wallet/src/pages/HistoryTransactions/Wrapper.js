import styled from 'styled-components'
import { TableCell } from '@chainx/ui'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const EmptyWrapper = styled.div`
  width: 100%;
  margin-top: 80px;
  margin-bottom: 80px;
  flex-direction: column;
`

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
