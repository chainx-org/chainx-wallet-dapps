import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;

  border-right: 1px solid #eeeeee;
  padding: 4px 15.5px 0 0;

  & > div.info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & > div.input {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 12px;
  }

  & > .percentage {
    margin-top: 16px;
  }

  & > .volume {
    font-size: 13px;
    color: #3f3f3f;
    line-height: 18px;
  }

  & > div.button {
    margin-top: 12px;
  }
`

export const Error = styled.div`
  font-size: 12px;
  color: #de071c;
`

export default Wrapper
