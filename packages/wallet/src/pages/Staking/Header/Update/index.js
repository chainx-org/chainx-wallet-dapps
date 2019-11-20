import React from 'react'
import styled from 'styled-components'
import updateIcon from './update.svg'

const Wrapper = styled.div`
  display: inline-flex;
  padding: 0 16px;
  border-left: 1px solid #eeeeee;
  height: 100%;
  cursor: pointer;
`

export default function() {
  return (
    <>
      <Wrapper onClick={() => console.log('hello world')}>
        <img src={updateIcon} alt="register" />
      </Wrapper>
    </>
  )
}
