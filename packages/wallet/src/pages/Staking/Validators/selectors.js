import { createSelector } from '@reduxjs/toolkit'
import {
  activeIntentionsSelector,
  normalizedIntentionsSelector
} from '../../../reducers/intentionSlice'
import chunk from 'lodash.chunk'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { toPrecision } from '../../../utils'

// Intentions with selfVote > 1 PCX
const nonZeroNormalizedIntentionsSelector = createSelector(
  activeIntentionsSelector,
  pcxPrecisionSelector,
  (intentions, precision) => {
    return intentions.filter(
      intention => parseInt(toPrecision(intention.selfVote, precision)) > 0
    )
  }
)

export const intentionChunksSelector = createSelector(
  normalizedIntentionsSelector,
  intentions => {
    return chunk(intentions, 4)
  }
)

export const activeIntentionChunksSelector = createSelector(
  nonZeroNormalizedIntentionsSelector,
  intentions => {
    return chunk(intentions, 4)
  }
)
