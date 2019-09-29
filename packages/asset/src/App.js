import React from 'react'
import PcxCard from './pages/PcxCard'
import Assets from './pages/Assets'
import styled from 'styled-components'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './pages/Header'

const Wrapper = styled.div`
  margin: 16px auto 0;
  min-width: 1280px;
  max-width: 1440px;
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
    <Router>
      <Header />
      <Wrapper className="App">
        <PcxCard />
        <Assets />
      </Wrapper>
    </Router>
  )
}

export default App
