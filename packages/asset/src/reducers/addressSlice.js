import { createSlice } from 'redux-starter-kit'

const addressSlice = createSlice({
  slice: 'address',
  initialState: {
    name: 'mine',
    address: '5QtntcJYGdnQ5dNfZrAqBNfJbvSw7u7akvzwxCEzUhL1JibT'
  },
  reducers: {}
})

export default addressSlice.reducer
