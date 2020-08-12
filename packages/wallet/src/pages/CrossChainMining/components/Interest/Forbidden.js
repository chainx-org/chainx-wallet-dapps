import React, { useRef } from 'react'
import styled from 'styled-components'
import useOutsideClick from '../../../../utils/useClickOutside'
import { noneFunc } from '../../../../utils'
import $t from '../../../../locale'

const Wrapper = styled.div`
  position: absolute;
  padding: 16px;
  background: rgba(255, 255, 255);
  border: 1px solid #dce0e2;
  border-radius: 10px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  z-index: 9;
  top: 30px;

  p {
    opacity: 0.72;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
  }
`

export default function({ close = noneFunc }) {
  const popup = useRef(null)
  useOutsideClick(popup, () => {
    close()
  })

  return (
    <Wrapper ref={popup}>
      <p>{$t('psedu_forbidden_mining')}</p>
    </Wrapper>
  )
}
