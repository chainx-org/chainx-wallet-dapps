import { createSelector } from 'redux-starter-kit'
import moment from 'moment'
import { timeFormat } from '../../utils/constants'
import { intentionsSelector } from '../../reducers/intentionSlice'
import { getChainx } from '../../services/chainx'

const head = state => state.chain.head

export const blockTimeSelector = createSelector(
  head,
  head => {
    if (!head) {
      return null
    }

    const timestamp = head.now * 1000
    return moment(timestamp).format(timeFormat)
  }
)

export const producerSelector = createSelector(
  head,
  intentionsSelector,
  (head, intentions) => {
    if (!head || intentions.length <= 0) {
      return null
    }

    const producerAccount = getChainx().account.decodeAddress(head.producer)
    const intention = intentions.find(
      intention => intention.account === producerAccount
    )
    return `(${intention.name})`
  }
)
