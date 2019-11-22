import React from 'react'
import styled from 'styled-components'
import infoIcon from '../svg/info.svg'

const Wrapper = styled.div`
  z-index: 2;
  text-align: left;
`

export default function({ onClick }) {
  return (
    <Wrapper>
      <img src={infoIcon} alt="info" onClick={onClick} />
    </Wrapper>
  )
}
