import { createSelector } from '@reduxjs/toolkit'
import { addressSelector } from '../reducers/addressSlice'
import { networkSelector } from '../reducers/settingsSlice'
import { mainNetDemoAccount, testNetDemoAccount } from '../utils/constants'

export function isDemoAccount(addr, network) {
  const isTestnetDemo =
    network === 'testnet' && addr === testNetDemoAccount.address
  const isMainnetDemo =
    network === 'mainnet' && addr === mainNetDemoAccount.address
  return isMainnetDemo || isTestnetDemo
}

export const isDemoSelector = createSelector(
  addressSelector,
  networkSelector,
  isDemoAccount
)
