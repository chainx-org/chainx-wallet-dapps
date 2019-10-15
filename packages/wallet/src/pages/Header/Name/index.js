import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { nameSelector } from '../../../reducers/addressSlice'
import moreIcon from './more.svg'
import AccountList from './AccountList'

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

export default function() {
  const name = useSelector(nameSelector)
  const [showList, setShowList] = useState(false)

  const toggleList = () => setShowList(!showList)

  return (
    <Name>
      <div className="info" onClick={toggleList}>
        <span>{name}</span>
        <img src={moreIcon} alt="more" />
      </div>
      {showList ? <AccountList /> : null}
    </Name>
  )
}
