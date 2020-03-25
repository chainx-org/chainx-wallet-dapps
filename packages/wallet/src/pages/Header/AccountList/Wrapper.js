import styled from 'styled-components'

const Wrapper = styled.ul`
  position: absolute;
  top: 56px;
  right: 16px;
  padding: 16px;

  width: 350px;

  background: rgba(255, 255, 255, 1);
  border: 1px solid #dce0e2;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 10px;

  z-index: 99;

  & > li {
    cursor: pointer;
    &:not(:first-of-type) {
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
    &:not(:last-of-type) {
      padding-bottom: 10px;
    }

    h4 {
      display: flex;
      justify-content: space-between;

      margin: 0;
      font-size: 13px;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 18px;

      span {
        opacity: 0.72;
      }

      span.extension {
        background: #f6c94a;
        border: 1px solid rgba(0, 0, 0, 0.04);
        border-radius: 10px;

        padding: 0 15px;

        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }
    }
    p {
      margin-top: 8px;
      opacity: 0.32;
      font-size: 12px;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 16px;

      overflow-x: hidden;
      text-overflow: ellipsis;
    }
  }
`

export default Wrapper
