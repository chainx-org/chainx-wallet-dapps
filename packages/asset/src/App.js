import React from 'react'
import PcxCard from './pages/PcxCard'
import Assets from './pages/Assets'
import styled from 'styled-components'

const Wrapper = styled.div`
  & > section:not(:first-of-type) {
    display: flex;
    margin-top: 16px;

    & > section {
      flex: 1;

      &:not(:first-of-type) {
        margin-left: 16px;
      }
    }
  }
`

function App() {
  return (
    <Wrapper className="App">
      <PcxCard />
      <Assets />
    </Wrapper>
  )
}

export default App
