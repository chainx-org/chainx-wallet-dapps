import { createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'

const rightSlice = createSlice({
  name: 'right',
  initialState: {
    proposals: []
  },
  reducers: {
    setProposals(state, { payload }) {
      state.proposals = payload
    }
  }
})

export const { setProposals } = rightSlice.actions

export const fetchProposals = () => async dispatch => {
  const api = getChainx()
  const assets = await api.derive.democracy.proposals()
  const data = JSON.parse(JSON.stringify(assets))
  console.log(data)

  dispatch(setProposals(data))
}

export const proposalsSelector = state => state.right.proposals
