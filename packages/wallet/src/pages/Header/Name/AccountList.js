import React from 'react'
import styled from 'styled-components'
import $t from '../../../locale'

const Wrapper = styled.ul`
  position: absolute;
  top: 56px;
  right: 0;
  padding: 16px;

  width: 300px;

  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #dce0e2;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 10px;

  z-index: 2;

  & > li {
    h4 {
      margin: 0;
      opacity: 0.72;
      font-size: 13px;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 18px;
    }
    p {
      margin-top: 8px;
      opacity: 0.32;
      font-size: 12px;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 16px;

      overflow-x: hidden;
      text-overflow: ellipsis;
    }
  }
`

export default function() {
  return (
    <Wrapper>
      <li>
        <h4>{$t('HEADER_DEMO_ACCOUNT')}</h4>
        <p>5TGy4d488i7pp3sjzi1gibqFUPLShddfk7qPY2S445ErhDGq</p>
      </li>
    </Wrapper>
  )
}
