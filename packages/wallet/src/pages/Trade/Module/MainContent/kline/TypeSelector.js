import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { klineTypeSelector, setType } from '../../../../../reducers/klineSlice'

const Ul = styled.ul`
  display: flex;
  li {
    cursor: pointer;
    padding: 3px 6px;
    border-radius: 1px;
    color: #9ca8c1;
    font-size: 12px;
    &.active {
      background: #e1eaf8;
      color: #3f3f3f;
    }
  }
`

const types = [
  {
    name: '1min',
    type: 60
  },
  {
    name: '5min',
    type: 300
  },
  {
    name: '30min',
    type: 1800
  },
  {
    name: '1day',
    type: 86400
  },
  {
    name: '1week',
    type: 604800
  },
  {
    name: '30 days',
    type: 2592000
  }
]

export default function() {
  const type = useSelector(klineTypeSelector)
  const dispatch = useDispatch()

  return (
    <Ul>
      {types.map(t => {
        return (
          <li
            key={t.type}
            className={t.type === type ? 'active' : ''}
            onClick={() => dispatch(setType(t.type))}
          >
            {t.name}
          </li>
        )
      })}
    </Ul>
  )
}
