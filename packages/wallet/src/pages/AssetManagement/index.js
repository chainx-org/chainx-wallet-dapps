import React from 'react'
import PcxCard from './PcxCard'
import Assets from './Assets'
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

function AssetManagement() {
  return (
    <Wrapper>
      <PcxCard />
      <Assets />
    </Wrapper>
  )
}

export default AssetManagement
