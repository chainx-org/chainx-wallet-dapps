import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  padding: 16px 0;
  background: rgba(255, 255, 255);
  border: 1px solid #dce0e2;
  border-radius: 10px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  z-index: 9;
  bottom: 60px;
  left: 30px;
  max-width: 350px;

  ul {
    li {
      padding: 0 16px;
      h3 {
        display: flex;
        align-items: flex-start;
        opacity: 0.72;
        font-weight: 500;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0.12px;
        line-height: 20px;
        margin: 0 0 8px;
        img {
          margin-right: 6px;
          margin-top: 2px;
          width: 16px;
        }
      }

      &:first-of-type {
        border-bottom: 1px solid #eeeeee;
      }

      &:not(:first-of-type) {
        padding-top: 12px;
      }

      & > div {
        margin-left: 22px;
        header {
          opacity: 0.32;
          font-size: 12px;
          color: #000000;
          letter-spacing: 0.2px;
          line-height: 16px;
          padding: 0;
        }
        p {
          opacity: 0.72;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0.12px;
          line-height: 20px;
        }
      }
    }
  }
`
