import { createSlice, createSelector } from 'redux-starter-kit'

let initialState = {
  name: 'abc',
  address: '5TGy4d488i7pp3sjzi1gibqFUPLShddfk7qPY2S445ErhDGq'
}

const addressSlice = createSlice({
  slice: 'address',
  initialState,
  reducers: {
    setAccount: {
      reducer(state, action) {
        state.name = action.payload.name
        state.address = action.payload.address
      }
    }
  }
})

export const { setAccount } = addressSlice.actions

export const addressSelector = state => state.address.address
export const nameSelector = state => state.address.name
export const accountSelector = createSelector(
  nameSelector,
  addressSelector,
  (name, address) => ({ name, address })
)

export default addressSlice.reducer
