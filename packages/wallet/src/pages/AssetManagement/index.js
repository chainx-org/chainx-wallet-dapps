import React from 'react'
import PcxCard from './PcxCard'
import Assets from './Assets'
import styled from 'styled-components'
import Records from './Records'

const Wrapper = styled.div`
  display: flex;
  div.left {
    flex: 1;
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
  }

  div.right {
    width: 300px;
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    & > section {
      height: 100%;

      display: flex;
      flex-direction: column;
    }
  }
`

function AssetManagement() {
  return (
    <Wrapper>
      <div className="left">
        <PcxCard />
        <Assets />
      </div>
      <div className="right">
        <Records />
      </div>
    </Wrapper>
  )
}

export default AssetManagement
