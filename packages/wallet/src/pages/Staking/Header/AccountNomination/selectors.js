import { createSelector } from 'redux-starter-kit'
import {
  intentionsSelector,
  nominationRecordsSelector
} from '../../../../reducers/intentionSlice'
import { pcxPrecisionSelector } from '../../../selectors/assets'
import { toPrecision } from '../../../../utils'
import { blockNumberSelector } from '../../../../reducers/chainSlice'

export const totalNominationBalanceSelector = createSelector(
  nominationRecordsSelector,
  pcxPrecisionSelector,
  (records, precision) => {
    const total = records.reduce((result, record) => {
      return result + record.info.nomination
    }, 0)

    return toPrecision(total, precision)
  }
)

export const totalRevocationBalanceSelector = createSelector(
  nominationRecordsSelector,
  pcxPrecisionSelector,
  (records, precision) => {
    const total = records.reduce((result, record) => {
      const intentionRevocation = record.info.revocations.reduce(
        (result, revocation) => result + revocation.value,
        0
      )
      return result + intentionRevocation
    }, 0)

    return toPrecision(total, precision)
  }
)

function calcInterest(record, intentions = [], blockNumber) {
  const intention = intentions.find(
    intention => intention.account === record.intention
  )
  if (!intention) {
    return 0
  }

  // // 用户最新总票龄  = （链最新高度 - 用户总票龄更新高度）*用户投票金额 +用户总票龄
  const myWeight =
    (blockNumber - record.info.lastVoteWeightUpdate) * record.info.nomination +
    Number(record.info.lastVoteWeight)
  // 节点最新总票龄  = （链最新高度 - 节点总票龄更新高度）*节点得票总额 +节点总票龄
  const nodeVoteWeight =
    (blockNumber - intention.lastTotalVoteWeightUpdate) *
      intention.totalNomination +
    Number(intention.lastTotalVoteWeight)

  // 待领利息 = 用户最新总票龄 / 节点最新总票龄 * 节点奖池金额
  return (myWeight / nodeVoteWeight) * intention.jackpot
}

export const totalInterestSelector = createSelector(
  nominationRecordsSelector,
  intentionsSelector,
  blockNumberSelector,
  pcxPrecisionSelector,
  (records, intentions, blockNumber, precision) => {
    if (blockNumber === null) {
      return toPrecision(0, precision)
    }

    const total = records.reduce((result, record) => {
      const interest = calcInterest(record, intentions, blockNumber)
      return result + interest
    }, 0)

    return toPrecision(total, precision)
  }
)
