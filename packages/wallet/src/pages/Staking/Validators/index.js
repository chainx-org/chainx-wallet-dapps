import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Intention from './Intention'
import {
  activeIntentionChunksSelector,
  intentionChunksSelector
} from './selectors'
import { WhiteButton } from '@chainx/ui'
import $t from '../../../locale'

const Main = styled.main`
  overflow-y: auto;
  padding-bottom: 16px;
  & > div {
    margin: 0 auto;
    min-width: 1280px;
    max-width: 1440px;

    &.chunks {
      display: flex;
      justify-content: center;
      & > ul {
        min-width: 1248px;
      }
    }
  }

  ul {
    display: flex;
    justify-content: flex-start;

    margin-top: 16px;

    &.line {
      & > li:not(:first-of-type) {
        margin-left: 16px;
      }
    }
  }
`

export default function() {
  const [showDropout, setShowDropout] = useState(false)

  const intentionChunks = useSelector(activeIntentionChunksSelector)
  const allIntentionChunks = useSelector(intentionChunksSelector)

  const chunks = showDropout ? allIntentionChunks : intentionChunks

  return (
    <Main>
      {chunks.map((intentions, index) => {
        return (
          <div className="chunks" key={index}>
            <ul className="line">
              {intentions.map(intention => {
                return (
                  <li key={intention.account}>
                    <Intention intention={intention} />
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
      {showDropout ? null : (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <WhiteButton size="large" onClick={() => setShowDropout(true)}>
            {$t('STAKING_CHECK_DROP_OUT')}
          </WhiteButton>
        </div>
      )}
    </Main>
  )
}
