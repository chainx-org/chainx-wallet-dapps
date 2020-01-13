import styled from 'styled-components'

const Wrapper = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: unset !important;

  & > span {
    cursor: pointer;
    display: inline-flex;
    align-items: center;

    background: #f6c94a;
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    padding: 6px;

    font-size: 14px;
    color: rgba(0, 0, 0, 0.72);
    letter-spacing: 0.12px;
    line-height: 20px;

    & > img {
      margin-right: 12px;
    }
  }

  & > img {
    cursor: pointer;
  }
`

export default Wrapper
