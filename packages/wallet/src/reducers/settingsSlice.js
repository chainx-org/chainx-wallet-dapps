import { createSelector, createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    locale: 'zh',
    network: 'mainnet'
  },
  reducers: {
    setLocale(state, action) {
      state.locale = action.payload
    },
    setNetwork(state, action) {
      state.network = action.payload
    }
  }
})

export const localeSelector = state => state.settings?.locale
export const networkSelector = state => state.settings?.network
export const isTestNetSelector = createSelector(
  networkSelector,
  network => network === 'testnet'
)

export const { setLocale, setNetwork } = settingsSlice.actions

export default settingsSlice.reducer
