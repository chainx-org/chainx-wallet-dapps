import React, { useEffect } from 'react'
import ClipboardJS from 'clipboard'
import uniqid from 'uniqid'
import copyIcon from '../static/copy.svg'
import styled from 'styled-components'

const Wrapper = styled.span`
  word-break: break-all;
  word-wrap: break-word;

  i {
    margin-left: 2px;
    img {
      width: 11px;
      cursor: pointer;
    }
  }
`

export default function ClipBoard(props) {
  useEffect(() => {
    const clipBoard = new ClipboardJS('.clipboard')

    return function() {
      clipBoard.destroy()
    }
  }, [])

  const uid = props.id || uniqid('clipboard_')

  const { children, className } = props
  return (
    <Wrapper>
      <span id={uid} className={className}>
        {children}
      </span>
      <i className="clipboard" data-clipboard-target={`#${uid}`}>
        <img src={copyIcon} alt="Copy" />
      </i>
    </Wrapper>
  )
}
