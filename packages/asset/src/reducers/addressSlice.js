import { createSlice } from 'redux-starter-kit'

const addressSlice = createSlice({
  slice: 'address',
  initialState: {
    name: 'demo',
    address: '5TGy4d488i7pp3sjzi1gibqFUPLShddfk7qPY2S445ErhDGq'
  },
  reducers: {}
})

export default addressSlice.reducer
