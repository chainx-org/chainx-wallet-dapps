import styled from 'styled-components'
import BaseCell from './BaseCell'

const PriceCell = styled(BaseCell)`
  font-weight: 600 !important;
  font-size: 12px !important;
  color: #dc6e46 !important;
  line-height: 20px;
  border-bottom: 0 !important;
  width: 50%;
`

export const PriceAriseCell = styled(PriceCell)`
  color: #2caa84 !important;
`

export default PriceCell
