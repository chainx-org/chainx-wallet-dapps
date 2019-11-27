import styled from 'styled-components'

export default styled.section`
  position: relative;
  div.locale {
    display: flex;
    align-items: center;
    cursor: pointer;

    opacity: 0.72;
    font-size: 13px;
    color: #000000;
    letter-spacing: 0.2px;
    line-height: 18px;

    img.arrow {
      margin-left: 6px;
    }
    img.language {
      margin-right: 6px;
    }
  }
  ul.locale-setting {
    position: absolute;
    bottom: 22px;
    right: 16px;

    background: rgba(255, 255, 255, 0.98);
    border: 1px solid #dce0e2;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    li {
      cursor: pointer;
      padding-left: 19px;
      width: 114px;
      opacity: 0.72;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 32px;
      &:hover {
        background: #f5f6f7;
      }
    }
  }
`
