import styled from 'styled-components'
import SideCard from '../../../components/SideCard'

const Wrapper = styled(SideCard)`
  padding: 16px 0;
`

export const Header = styled.header`
  ul {
    display: flex;
    justify-content: space-around;
    li {
      flex: 1;
      text-align: center;
      padding-bottom: 13px;

      opacity: 0.32;
      font-size: 14px;
      font-weight: 600;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;

      cursor: pointer;
      &.active {
        border-bottom: 3px solid #f6c94a;
        opacity: 0.72;
      }
    }
  }
`

export default Wrapper
