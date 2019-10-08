import Card from '../../../components/Card'
import styled from 'styled-components'

const CardWrapper = styled(Card)`
  width: 100%;

  & > header {
    margin: 3px 0 16px;
  }

  & > hr {
    margin: 0 -16px;
    border: 0.5px solid #eee;
  }
`

export default CardWrapper
