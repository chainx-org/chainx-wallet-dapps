import { createSlice } from 'redux-starter-kit'

const settingsSlice = createSlice({
  slice: 'settings',
  initialState: {
    locale: 'en',
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
