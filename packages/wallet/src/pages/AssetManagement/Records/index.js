import React, { useState } from 'react'
import Card from '../../../components/Card'
import styled from 'styled-components'
import TransferRecords from './TransferRecords'
import CrossChainRecords from './CrossChainRecords'

const Wrapper = styled(Card)`
  & > header {
    ul {
      display: flex;
      & > li {
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.32);
        letter-spacing: 0.12px;
        line-height: 20px;
        cursor: pointer;
        padding-bottom: 16px;
        &.active {
          border-bottom: 3px solid #f6c94a;
        }
        &:not(:first-of-type) {
          margin-left: 24px;
        }
      }
    }
  }
`

export default function() {
  const [recordType, setRecordType] = useState(1)

  return (
    <Wrapper>
      <header>
        <ul>
          <li
            onClick={() => setRecordType(1)}
            className={recordType === 1 ? 'active' : null}
          >
            转账记录
          </li>
          <li
            onClick={() => setRecordType(2)}
            className={recordType === 2 ? 'active' : null}
          >
            跨链记录
          </li>
          <li
            onClick={() => setRecordType(3)}
            className={recordType === 3 ? 'active' : null}
          >
            联系地址
          </li>
        </ul>
      </header>
      <main>
        {recordType === 1 ? <TransferRecords /> : null}
        {recordType === 2 ? <CrossChainRecords /> : null}
      </main>
    </Wrapper>
  )
}
