import { createSelector, createSlice } from 'redux-starter-kit'

let initialState = {
  name: 'abc',
  address: '5TGy4d488i7pp3sjzi1gibqFUPLShddfk7qPY2S445ErhDGq',
  isFromExtension: false,
  extensionAccounts: []
}

const addressSlice = createSlice({
  slice: 'address',
  initialState,
  reducers: {
    setAccount: {
      reducer(state, action) {
        state.name = action.payload.name
        state.address = action.payload.address
        state.isFromExtension = action.payload.isFromExtension
        window.location.reload()
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
export const nameSelector = state => state.address.name
export const accountSelector = createSelector(
  nameSelector,
  addressSelector,
  (name, address) => ({ name, address })
)
export const extensionAccountsSelector = state =>
  state.address.extensionAccounts

export default addressSlice.reducer
