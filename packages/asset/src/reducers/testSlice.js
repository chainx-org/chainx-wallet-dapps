import { createSlice } from 'redux-starter-kit'

const testSlice = createSlice({
  slice: 'test',
  initialState: 'test',
  reducers: {
    setTest: {
      reducer(state, action) {
        const { text } = action.payload
        state = text
      },
      prepare(text) {
        return { payload: { text } }
      }
    }
  }
})

export const { setTest } = testSlice.actions

export default testSlice.reducer
