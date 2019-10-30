import { createSlice } from 'redux-starter-kit'
import { getChainx } from '../services/chainx'

const bitcoin = 'Bitcoin'

const trustSlice = createSlice({
  slice: 'trust',
  initialState: {
    withdrawals: [],
    trusteeSessionInfo: null
  },
  reducers: {
    setWithdrawals: {
      reducer(state, action) {
        state.withdrawals = action.payload
      }
    },
    setTrusteeSessionInfo: {
      reducer(state, action) {
        state.trusteeSessionInfo = action.payload
      }
    }
  }
})

export const hotAddressSelector = state =>
  state.trust.trusteeSessionInfo &&
  state.trust.trusteeSessionInfo.hotEntity.addr
export const withdrawalsSelector = state => state.trust.withdrawals

const { setWithdrawals, setTrusteeSessionInfo } = trustSlice.actions

export const fetchWithdrawals = () => async dispatch => {
  const { asset } = await getChainx()
  const { data } = await asset.getWithdrawalList(bitcoin, 0, 1000)
  dispatch(setWithdrawals(data))
}

export const fetchTrusteeSessionInfo = () => async dispatch => {
  const { trustee } = await getChainx()
  const resp = await trustee.getTrusteeSessionInfo(bitcoin)

  dispatch(setTrusteeSessionInfo(resp))
}

export default trustSlice.reducer
