import { createSelector } from '@reduxjs/toolkit'
import { token } from '../../../utils/constants'
import {
  pseduNominationRecordsSelector,
  xbtcIntentionSelector
} from '../selectors'
import { blockNumberSelector, headSelector } from '../../../reducers/chainSlice'
import { calcPseduIntentionInterest, getClaimInfo } from '../common'
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
  calcPseduIntentionInterest
)

export const xbtcClaimInfoSelector = createSelector(
  headSelector,
  pcxAssetSelector,
  xbtcRecordSelector,
  xbtcInterestSelector,
  getClaimInfo
)
