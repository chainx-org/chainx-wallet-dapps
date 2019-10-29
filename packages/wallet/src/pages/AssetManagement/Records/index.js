import React, { useState } from 'react'
import Card from '../../../components/Card'
import styled from 'styled-components'
import TransferRecords from './TransferRecords'
import CrossChainRecords from './CrossChainRecord'
import $t from '../../../locale'

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

  & > main {
    flex: 1;
    overflow-y: auto;
    margin: 0 -16px;
    border-top: 1px solid #eee;
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
            {$t('ASSET_TRANSFER_RECORD')}
          </li>
          <li
            onClick={() => setRecordType(2)}
            className={recordType === 2 ? 'active' : null}
          >
            {$t('ASSET_CROSS_CHAIN_RECORD')}
          </li>
          <li
            onClick={() => setRecordType(3)}
            className={recordType === 3 ? 'active' : null}
          >
            {$t('ASSET_CONTACT')}
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
