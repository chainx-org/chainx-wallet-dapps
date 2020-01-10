import React from 'react'
import styled from 'styled-components'
import signerIcon from '../signer.svg'
import $t from '../../../../locale'
import signerDownloadIcon from './signer_download.svg'
import { useDispatch } from 'react-redux'
import { setOpenSignerDownloadDialog } from '../../../../reducers/runStatusSlice'

const Wrapper = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: unset !important;

  & > span {
    cursor: pointer;
    display: inline-flex;
    align-items: center;

    background: #3f3f3f;
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    padding: 6px;

    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0.12px;
    line-height: 20px;

    & > img {
      margin-right: 12px;
    }
  }

  & > img {
    cursor: pointer;
  }
`

export default function() {
  const dispatch = useDispatch()

  return (
    <Wrapper>
      <span>
        <img src={signerIcon} alt="extension" />
        <span>{$t('HEADER_CONNECT_SIGNER')}</span>
      </span>
      <img
        src={signerDownloadIcon}
        onClick={() => {
          dispatch(setOpenSignerDownloadDialog(true))
        }}
        alt="download signer"
      />
    </Wrapper>
  )
}
