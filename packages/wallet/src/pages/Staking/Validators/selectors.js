import { createSelector } from 'redux-starter-kit'
import {
  activeIntentionsSelector,
  normalizedIntentionsSelector
} from '../../../reducers/intentionSlice'
import chunk from 'lodash.chunk'

export const intentionChunksSelector = createSelector(
  normalizedIntentionsSelector,
  intentions => {
    return chunk(intentions, 4)
  }
)

export const activeIntentionChunksSelector = createSelector(
  activeIntentionsSelector,
  intentions => chunk(intentions, 4)
)
