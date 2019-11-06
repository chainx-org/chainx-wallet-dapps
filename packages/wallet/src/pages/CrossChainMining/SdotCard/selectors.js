import { createSelector } from 'redux-starter-kit'
import {
  pseduNominationRecordsSelector,
  sdotIntentionSelector
} from '../selectors'
import { token } from '../../../utils/constants'
import { blockNumberSelector, headSelector } from '../../../reducers/chainSlice'
import { calcInterest, getClaimInfo } from '../common'
import { pcxAssetSelector } from '../../AssetManagement/PcxCard/selectors'

const sdotRecordSelector = createSelector(
  pseduNominationRecordsSelector,
  records => {
    return records.find(record => token.SDOT === record.id)
  }
)

export const sdotInterestSelector = createSelector(
  blockNumberSelector,
  sdotIntentionSelector,
  sdotRecordSelector,
  calcInterest
)

export const sdotClaimInfoSelector = createSelector(
  headSelector,
  pcxAssetSelector,
  sdotRecordSelector,
  sdotInterestSelector,
  getClaimInfo
)
