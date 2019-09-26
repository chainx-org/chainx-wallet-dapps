import { createSlice } from 'redux-starter-kit'

const settingsSlice = createSlice({
  slice: 'settings',
  initialState: {
    locale: 'zh'
  },
  reducers: {
    setLocale: {
      reducer(state, action) {
        state.locale = action.payload
      }
    }
  }
})

export const { setLocale } = settingsSlice.actions

export default settingsSlice.reducer
