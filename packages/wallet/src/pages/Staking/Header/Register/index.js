import React, { useState } from 'react'
import registerIcon from './register.svg'
import styled from 'styled-components'
import RegisterNodeDialog from './RegisterNodeDialog'

const Wrapper = styled.div`
  display: inline-flex;
  padding: 0 16px;
  border-left: 1px solid #eeeeee;
  height: 100%;
  cursor: pointer;
`

export default function() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Wrapper onClick={() => setOpen(true)}>
        <img src={registerIcon} alt="register" />
      </Wrapper>
      {open ? <RegisterNodeDialog handleClose={() => setOpen(false)} /> : null}
    </>
  )
}
