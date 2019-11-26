import { createSelector } from '@reduxjs/toolkit'
import { intentionsSelector } from '../../../../../reducers/intentionSlice'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { getChainx } from '../../../../../services/chainx'

export const myIntentionSelector = createSelector(
  intentionsSelector,
  addressSelector,
  (intentions, address) => {
    const chainx = getChainx()
    const accountId = chainx.account.decodeAddress(address, false)

    return (intentions || []).find(intention => intention.account === accountId)
  }
)
