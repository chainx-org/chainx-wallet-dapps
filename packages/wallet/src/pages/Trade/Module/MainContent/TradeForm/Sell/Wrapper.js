import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
  padding: 4px 0 0 15.5px;

  & > div.input {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 12px;
  }
`

export default Wrapper
