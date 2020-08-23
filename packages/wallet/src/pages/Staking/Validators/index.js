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
import { LoadingWithText } from '../../../components'
import { loadingIntentionsSelector } from '../../../reducers/runStatusSlice'
import { validatorChunksSelector } from '@reducers/validatorSlice'

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

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 30px;
`

export default function() {
  const [showDropout, setShowDropout] = useState(false)

  const intentionChunks = useSelector(validatorChunksSelector)
  const allIntentionChunks = useSelector(validatorChunksSelector)
  const loadingIntentions = useSelector(loadingIntentionsSelector)

  const chunks = showDropout ? allIntentionChunks : intentionChunks

  if (loadingIntentions) {
    return (
      <LoadingWrapper className="staking">
        <LoadingWithText text={$t('STAKING_LOADING_INTENTIONS')} />
      </LoadingWrapper>
    )
  }

  return (
    <Main>
      {chunks.map((chunk, index) => {
        return (
          <div className="chunks" key={index}>
            <ul className="line">
              {chunk.map(validator => {
                return (
                  <li key={validator.account}>
                    <Intention intention={validator} />
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
