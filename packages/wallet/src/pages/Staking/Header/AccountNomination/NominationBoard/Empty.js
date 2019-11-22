import React from 'react'
import noneIcon from '../../../../../static/none.svg'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-width: 544px;
  min-height: 224px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p {
    opacity: 0.24;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    text-align: center;
    line-height: 20px;
  }
`

export default function() {
  return (
    <Wrapper>
      <section>
        <img src={noneIcon} alt="empty" />
      </section>
      <p>请先对节点投票</p>
      <p>投票后才能获得挖矿收益</p>
    </Wrapper>
  )
}
