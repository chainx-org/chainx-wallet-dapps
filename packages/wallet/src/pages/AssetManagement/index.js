import React from 'react'
import PcxCard from './PcxCard'
import Assets from './Assets'
import styled from 'styled-components'
import Records from './Records'
import Warning from './Warning'

const Wrapper = styled.div`
  display: flex;
  div.left {
    flex: 1;
  }

  div.right {
    width: 300px;
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    & > section {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
`
const NewWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
function AssetManagement() {
  return (
    <NewWrapper>
      <Warning />
      <Wrapper>
        <div className="left">
          <PcxCard />
          <Assets />
        </div>
        <div className="right">
          <Records />
        </div>
      </Wrapper>
    </NewWrapper>
  )
}

export default AssetManagement
