import styled from 'styled-components'
import React from 'react'
import loading from '../Loading/loading.gif'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  z-index: 2000;
  img {
    width: 32px;
  }
`
export default function(props) {
  return (
    <Wrapper className={props.className} style={props.style}>
      <img src={loading} alt="loading" />
    </Wrapper>
  )
}
