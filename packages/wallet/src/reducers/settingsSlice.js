import { createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    locale: 'zh',
    network: 'mainnet'
  },
  reducers: {
    setLocale: {
      reducer(state, action) {
        state.locale = action.payload
      }
    },
    setNetwork: {
      reducer(state, action) {
        state.network = action.payload
      }
    }
  }
})

export const localeSelector = state => state.settings.locale
export const networkSelector = state => state.settings.network

export const { setLocale, setNetwork } = settingsSlice.actions

export default settingsSlice.reducer
