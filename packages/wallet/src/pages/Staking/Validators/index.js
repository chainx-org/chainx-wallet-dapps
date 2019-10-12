import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Intention from './Intention'
import { activeIntentionChunksSelector } from './selectors'

const Main = styled.main`
  overflow-y: auto;
  padding-bottom: 16px;
  & > div {
    margin: 0 auto;
    min-width: 1280px;
    max-width: 1440px;
  }

  ul {
    display: flex;
    justify-content: space-between;

    margin-top: 16px;
  }
`

export default function() {
  const intentionChunks = useSelector(activeIntentionChunksSelector)

  return (
    <Main>
      <div>
        {intentionChunks.map((intentions, index) => {
          return (
            <ul key={index}>
              {intentions.map(intention => {
                return (
                  <li key={intention.account}>
                    <Intention intention={intention} />
                  </li>
                )
              })}
            </ul>
          )
        })}
      </div>
    </Main>
  )
}
