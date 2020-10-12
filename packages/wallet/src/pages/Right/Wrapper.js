import styled from 'styled-components'

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;

  ul {
    display: flex;
    justify-content: space-around;
    li {
      opacity: 0.32;
      font-weight: 600;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;
      padding-bottom: 9px;

      cursor: pointer;
      &.active {
        border-bottom: 3px solid #f6c94a;
        opacity: 0.72;
      }

      &:last-of-type {
        margin-left: 24px;
      }
    }
  }
`
