import { createSlice } from 'redux-starter-kit'
import store from 'store'

const localSlice = createSlice({
  slice: 'store',
  initialState: {
    abiList: [],
    contractList: []
  },
  reducers: {
    setAbiList: {
      reducer(state, action) {
        state.abiList = action.payload
      }
    },
    setContractList: {
      reducer(state, action) {
        state.contractList = action.payload
      }
    }
  }
})

export const { setAbiList, setContractList } = localSlice.actions

export const fetchAbiAndContractList = () => async dispatch => {
  const _abiList = []
  const _contractList = []
  store.each(function(value, key) {
    if (key.indexOf('ABI_') > -1) {
      _abiList.push(value)
    } else if (key.indexOf('CONTRACT_') > -1) {
      _contractList.push(value)
    }
  })
  dispatch(setAbiList(_abiList))
  dispatch(setContractList(_contractList))
}

export default localSlice.reducer
