import styled from 'styled-components'
import SideCard from './SideCard'

const TitledCard = styled(SideCard)`
  padding-bottom: 10px;
  header {
    padding: 12px;
    opacity: 0.72;
    font-weight: 600;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
  }
`

export default TitledCard
