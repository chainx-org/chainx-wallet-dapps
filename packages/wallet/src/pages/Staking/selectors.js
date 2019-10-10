import { createSelector } from 'redux-starter-kit'
import { intentionsSelector } from '../selectors/intentions'
import { pcxPrecisionSelector } from '../selectors/assets'
import { toPrecision } from '../../utils'

export const totalNominationSelector = createSelector(
  intentionsSelector,
  pcxPrecisionSelector,
  (intentions, precision) => {
    if (intentions.length <= 0 || precision === null) {
      return null
    }

    const total = (intentions || []).reduce((result, intention) => {
      return result + intention.totalNomination
    }, 0)

    return toPrecision(total, precision)
  }
)
