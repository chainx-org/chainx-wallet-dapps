import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'

let initialState = {
  version: 1,
  account: null
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAccount: {
      reducer(state, action) {
        state.account = action.payload
      }
    }
  }
})

export const { setAccount } = addressSlice.actions

export const addressSelector = state => {
  return state.address.account?.address
}

export const accountIdSelector = createSelector(addressSelector, address => {
  if (!address) {
    return null
  }

  const chainx = getChainx()
  return chainx.account.decodeAddress(address, false)
})

export const nameSelector = state =>
  state.address.account && state.address.account.name
export const accountSelector = state => state.address.account

export const isExtensionSelector = state =>
  state.address.account?.isFromExtension
export const isSignerSelector = state => state.address.account?.isFromSigner
export const signerConnectedSelector = state =>
  state.address.account?.isFromSigner
export const isDemoSelector = state => {
  const account = state.address.account
  return !account.isFromExtension && !account.isFromSigner
}

export default addressSlice.reducer
