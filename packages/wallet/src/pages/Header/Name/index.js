import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { isDemoSelector, nameSelector } from '../../../reducers/addressSlice'
import moreIcon from './more.svg'
import $t from '../../../locale'

const Name = styled.span`
  height: 100%;
  display: inline-flex;
  align-items: center;

  position: relative;

  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.12px;
  line-height: 20px;
  cursor: pointer;
  user-select: none;

  & > div.info {
    height: 100%;
    line-height: 56px;
  }

  & > div > img {
    opacity: 0.5;
    margin-left: 8px;
  }
`

export default function({ onClick }) {
  const name = useSelector(nameSelector)
  const isDemo = useSelector(isDemoSelector)

  return (
    <Name>
      <div className="info" onClick={onClick}>
        <span>{isDemo ? $t('HEADER_DEMO_ACCOUNT') : name}</span>
        <img src={moreIcon} alt="more" />
      </div>
    </Name>
  )
}
