import styled from 'styled-components'
import React from 'react'
import loading from './loading.gif'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  user-select: none;
  background: rgba(0, 0, 0, 0.2);
`
export default function(props) {
  return (
    <Wrapper className={props.className} style={props.style}>
      <img src={loading} alt="loading" />
    </Wrapper>
  )
}
