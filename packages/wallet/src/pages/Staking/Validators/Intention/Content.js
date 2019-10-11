import React from 'react'
import styled from 'styled-components'
import defaultLogo from './svg/default-logo.svg'

const Wrapper = styled.div`
  display: flex;
  padding: 16px 16px 0;
  & > div.info {
    display: flex;

    img {
      width: 40px;
    }
    div.summary {
      margin-left: 16px;
      header {
        opacity: 0.72;
        font-size: 14px;
        font-weight: 500;
        color: #000000;
        line-height: 20px;
      }
    }
  }
`

export default function(props) {
  const { name, hasLogo, logo } = props.intention

  return (
    <Wrapper>
      <div className="info">
        <img src={hasLogo ? logo : defaultLogo} alt="validator logo" />
        <div className="summary">
          <header>{name}</header>
        </div>
      </div>
    </Wrapper>
  )
}
