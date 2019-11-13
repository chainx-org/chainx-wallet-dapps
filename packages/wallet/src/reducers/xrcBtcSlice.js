import { createSlice } from 'redux-starter-kit'
import { getChainx } from '../services/chainx'

const xrcbtcSlice = createSlice({
  slice: 'xrcbtc',
  initialState: {},
  reducers: {
    setTest: {
      reducer(state, action) {
        const { text } = action.payload
        return text
      }
    }
  }
})

export const { setTest } = xrcbtcSlice.actions

export const fetchXrcBtcBalance = accountId => async dispatch => {
  const chainx = getChainx()

  const result = await chainx.api.rpc.chainx.contractXRC20Call({
    token: 'BTC',
    selector: 'BalanceOf',
    inputData:
      '0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee'
  })

  console.log('result', result)
}

export default xrcbtcSlice.reducer
