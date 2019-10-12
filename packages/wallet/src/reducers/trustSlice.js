import { createSlice } from 'redux-starter-kit'
import chainx from '../services/chainx'

const trustSlice = createSlice({
  slice: 'trust',
  initialState: {
    withdrawals: []
  },
  reducers: {
    setWithdrawals: {
      reducer(state, action) {
        state.withdrawals = action.payload
      }
    }
  }
})

async function getAsset() {
  await chainx.isRpcReady()
  const { asset } = chainx

  return asset
}

const { setWithdrawals } = trustSlice.actions

export const fetchWithdrawals = () => async dispatch => {
  const asset = await getAsset()
  const { data } = await asset.getWithdrawalList('Bitcoin', 0, 1000)
  dispatch(setWithdrawals(data))
}

export const withdrawalsSelector = state => state.trust.withdrawals

export default trustSlice.reducer
