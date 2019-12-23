import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'

let initialState = {
  name: 'abc',
  address: '5TGy4d488i7pp3sjzi1gibqFUPLShddfk7qPY2S445ErhDGq',
  isFromExtension: false,
  extensionAccounts: []
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAccount: {
      reducer(state, action) {
        state.name = action.payload.name
        state.address = action.payload.address
        state.isFromExtension = action.payload.isFromExtension
      }
    },
    setExtensionAccounts: {
      reducer(state, action) {
        state.extensionAccounts = action.payload
      }
    }
  }
})

export const { setAccount, setExtensionAccounts } = addressSlice.actions

export const addressSelector = state => state.address.address

export const accountIdSelector = createSelector(
  addressSelector,
  address => {
    if (!address) {
      return null
    }

    const chainx = getChainx()
    return chainx.account.decodeAddress(address, false)
  }
)

export const nameSelector = state => state.address.name
export const accountSelector = createSelector(
  nameSelector,
  addressSelector,
  (name, address) => ({ name, address })
)

export const extensionAccountsSelector = state =>
  state.address.extensionAccounts

export const isExtensionSelector = state => state.address.isFromExtension

export default addressSlice.reducer
