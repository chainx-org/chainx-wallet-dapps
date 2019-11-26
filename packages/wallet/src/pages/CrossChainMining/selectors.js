import { createSelector } from '@reduxjs/toolkit'
import { token } from '../../utils/constants'
import { toPrecision } from '../../utils'
import {
  xbtcPrecisionSelector,
  lbtcPrecisionSelector,
  sdotPrecisionSelector,
  pcxPrecisionSelector
} from '../selectors/assets'

export const pseduIntentionSelector = state => {
  return state.intentions.pseduIntentions
}

export const pseduNominationRecordsSelector = state => {
  return state.intentions.pseduNominationRecords
}

const generateBalanceSelector = function(id) {
  return createSelector(
    pseduNominationRecordsSelector,
    records => {
      const record = records.find(record => record.id === id)
      return record ? record.balance : 0
    }
  )
}

export const xbtcBalanceSelector = generateBalanceSelector(token.XBTC)
export const lbtcBalanceSelector = generateBalanceSelector(token.LBTC)
export const sdotBalanceSelector = generateBalanceSelector(token.SDOT)

const generateIntentionSelector = function(token) {
  return createSelector(
    pseduIntentionSelector,
    intentions => {
      return intentions.find(intention => intention.id === token) || null
    }
  )
}

export const xbtcIntentionSelector = generateIntentionSelector(token.XBTC)
export const lbtcIntentionSelector = generateIntentionSelector(token.LBTC)
export const sdotIntentionSelector = generateIntentionSelector(token.SDOT)

const generateSelector = function(
  intention,
  tokenBalance,
  tokenPrecision,
  pcxPrecision
) {
  return createSelector(
    intention,
    tokenBalance,
    tokenPrecision,
    pcxPrecision,
    (intention, tokenBalance = 0, tokenPrecision, pcxPrecision) => {
      if (!intention || tokenPrecision === null || pcxPrecision === null) {
        return {}
      }

      const circulation = intention.circulation / Math.pow(10, tokenPrecision)
      const power = intention.power / Math.pow(10, pcxPrecision)
      const vote = (circulation * power).toFixed(pcxPrecision)
      const jackpot = intention.jackpot / Math.pow(10, pcxPrecision)
      const balance = toPrecision(tokenBalance, tokenPrecision)

      return {
        circulation,
        power,
        vote,
        jackpot,
        balance
      }
    }
  )
}

export const normalizedXbtcSelector = generateSelector(
  xbtcIntentionSelector,
  xbtcBalanceSelector,
  xbtcPrecisionSelector,
  pcxPrecisionSelector
)
export const normalizedLbtcSelector = generateSelector(
  lbtcIntentionSelector,
  lbtcBalanceSelector,
  lbtcPrecisionSelector,
  pcxPrecisionSelector
)
export const normalizedSdotSelector = generateSelector(
  sdotIntentionSelector,
  sdotBalanceSelector,
  sdotPrecisionSelector,
  pcxPrecisionSelector
)
