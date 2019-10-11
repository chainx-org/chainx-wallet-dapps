import { createSelector } from 'redux-starter-kit'
import { normalizedIntentionsSelector } from '../../../reducers/intentionSlice'
import chunk from 'lodash.chunk'

export const intentionChunksSelector = createSelector(
  normalizedIntentionsSelector,
  intentions => {
    return chunk(intentions, 4)
  }
)
