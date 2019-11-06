import { createSelector } from 'redux-starter-kit'
import { token } from '../../../utils/constants'
import {
  pseduNominationRecordsSelector,
  xbtcIntentionSelector
} from '../selectors'
import { blockNumberSelector, headSelector } from '../../../reducers/chainSlice'
import { calcInterest } from '../common'
import { pcxAssetSelector } from '../../AssetManagement/PcxCard/selectors'

const xbtcRecordSelector = createSelector(
  pseduNominationRecordsSelector,
  records => {
    return records.find(record => record.id === token.XBTC)
  }
)

export const xbtcInterestSelector = createSelector(
  blockNumberSelector,
  xbtcIntentionSelector,
  xbtcRecordSelector,
  calcInterest
)

export const xbtcClaimInfoSelector = createSelector(
  headSelector,
  pcxAssetSelector,
  xbtcRecordSelector,
  xbtcInterestSelector,
  (head, pcx, record, interest) => {
    if (!head || !pcx || !record || !interest) {
      return
    }

    const { number: blockNumber } = head

    const hasEnoughStaking = pcx.reservedStaking > (interest * 100) / 9
    const reachClaimHeight = blockNumber > record.nextClaim
    const canClaim = interest > 0 && hasEnoughStaking && reachClaimHeight
    let needStakingPcx = 0
    if (!hasEnoughStaking) {
      needStakingPcx = (interest * 100) / 9 - pcx.reservedStaking
    }
    return {
      canClaim,
      hasEnoughStaking,
      reachClaimHeight,
      nextClaim: record.nextClaim,
      needStakingPcx
    }
  }
)
