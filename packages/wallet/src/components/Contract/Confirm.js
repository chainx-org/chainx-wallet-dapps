import React from 'react'
import styled from 'styled-components'
import closeGrayIcon from '../../static/close_gray.svg'
import { PrimaryButton, DefaultButton } from '@chainx/ui'
import Loading from './Loading'

const Confirm = styled.div`
  position: absolute;
  left: 50%;
  top: 16px;
  margin-left: -250px;
  width: 468px;
  min-height: 98px;
  background: #fafbfc;
  border: 1px solid #dce0e2;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1000;
  .confirm-header {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    img {
      cursor: pointer;
    }
  }
  .confirm-body {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .confirm-footer {
    display: flex;
    justify-content: flex-end;
  }
  .small-button {
    width: 120px;
    height: 40px;
    border-radius: 20px;
    &.right-button {
      margin-left: 16px;
    }
  }
`

export default function({ title, confirm, cancel, loading = false, children }) {
  return (
    <Confirm>
      {loading && <Loading />}
      <div className="confirm-header">
        <span>{title}</span>
        <img src={closeGrayIcon} alt="closeIcon" onClick={cancel} />
      </div>
      {children && <div className="confirm-body">{children}</div>}
      <div className="confirm-footer">
        <DefaultButton className="small-button" onClick={cancel}>
          Cancel
        </DefaultButton>
        <PrimaryButton className="small-button right-button" onClick={confirm}>
          Confirm
        </PrimaryButton>
      </div>
    </Confirm>
  )
}
