import styled from 'styled-components'
import BaseCell from './BaseCell'

const PriceCell = styled(BaseCell)`
  font-weight: 600 !important;
  font-size: 12px !important;
  color: #000 !important;
  line-height: 20px;
  border-bottom: 0 !important;
  width: 50%;
  padding: 0 0 0 12px !important;
`

export const PriceDownCell = styled(PriceCell)`
  color: #dc6e46 !important;
`

export const PriceAriseCell = styled(PriceCell)`
  color: #2caa84 !important;
`

export default PriceCell
