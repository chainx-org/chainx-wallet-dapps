import { createSelector } from 'redux-starter-kit'
import { token } from '../../../utils/constants'
import {
  pseduNominationRecordsSelector,
  xbtcIntentionSelector
} from '../selectors'
import { blockNumberSelector } from '../../../reducers/chainSlice'

const xbtcRecordSelector = createSelector(
  pseduNominationRecordsSelector,
  records => {
    return records.find(record => (record.id = token.XBTC))
  }
)

export const xbtcInterestSelector = createSelector(
  blockNumberSelector,
  xbtcIntentionSelector,
  xbtcRecordSelector,
  (blockNumber, intention, record) => {
    if (!record || !intention) {
      return 0
    }

    // 用户最新总票龄  = （链最新高度 - 用户总票龄更新高度）*用户投票金额 +用户总票龄
    const myWeight =
      (blockNumber - record.lastTotalDepositWeightUpdate) * record.balance +
      Number(record.lastTotalDepositWeight)

    // 节点最新总票龄  = （链最新高度 - 节点总票龄更新高度）*节点得票总额 +节点总票龄
    const nodeVoteWeight =
      (blockNumber - intention.lastTotalDepositWeightUpdate) *
        intention.circulation +
      Number(intention.lastTotalDepositWeight)

    // 待领利息 = 用户最新总票龄 / 节点最新总票龄 * 节点奖池金额

    // TODO: record.lastTotalDepositWeightUpdate <= 0的条件属于补救措施，后边应改掉
    const interest =
      nodeVoteWeight <= 0 || record.lastTotalDepositWeightUpdate <= 0
        ? 0
        : (myWeight / nodeVoteWeight) * intention.jackpot * 0.9

    return parseInt(interest)
  }
)
