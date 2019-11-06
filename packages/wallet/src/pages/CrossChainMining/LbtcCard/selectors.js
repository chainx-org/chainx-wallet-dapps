import { createSelector } from 'redux-starter-kit'
import {
  lbtcIntentionSelector,
  pseduNominationRecordsSelector
} from '../selectors'
import { token } from '../../../utils/constants'
import { blockNumberSelector, headSelector } from '../../../reducers/chainSlice'
import { calcInterest, getClaimInfo } from '../common'
import { pcxAssetSelector } from '../../AssetManagement/PcxCard/selectors'

const lbtcRecordSelector = createSelector(
  pseduNominationRecordsSelector,
  records => {
    return records.find(record => record.id === token.LBTC)
  }
)

export const lbtcInterestSelector = createSelector(
  blockNumberSelector,
  lbtcIntentionSelector,
  lbtcRecordSelector,
  calcInterest
)

export const lbtcClaimInfoSelector = createSelector(
  headSelector,
  pcxAssetSelector,
  lbtcRecordSelector,
  getClaimInfo
)
