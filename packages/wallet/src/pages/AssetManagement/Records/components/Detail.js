import styled from 'styled-components'

const Detail = styled.ul`
  position: absolute;
  width: 260px;
  padding: 16px;
  top: 58px;
  right: 2px;
  background: rgba(255, 255, 255);
  border: 1px solid #dce0e2;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  z-index: 9;
  & > li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:not(:first-of-type) {
      margin-top: 8px;
    }
    &.memo {
      align-items: flex-start;
    }
    p.memo {
      opacity: 0.56;
      font-size: 13px;
      color: #000000;
      letter-spacing: 0.2px;
      text-align: right;
      line-height: 18px;
    }
  }
`

export default Detail
