import { createSlice } from '@reduxjs/toolkit'

const runStatusSlice = createSlice({
  name: 'runStatus',
  initialState: {
    unNominateOpen: false,
    switchNominationOpen: false,
    voteOpen: false,
    unFreezeOpen: false
  },
  reducers: {
    setUnNominateOpen(state, action) {
      state.unNominateOpen = action.payload
    },
    setSwitchNominationOpen(state, action) {
      state.switchNominationOpen = action.payload
    },
    setVoteOpen(state, action) {
      state.voteOpen = action.payload
    },
    setUnFreezeOpen(state, action) {
      state.unFreezeOpen = action.payload
    }
  }
})

export const {
  setUnNominateOpen,
  setSwitchNominationOpen,
  setVoteOpen,
  setUnFreezeOpen
} = runStatusSlice.actions

export const unNominateOpenSelector = state => state.runStatus.unNominateOpen
export const switchNominationOpenSelector = state =>
  state.runStatus.switchNominationOpen
export const voteOpenSelector = state => state.runStatus.voteOpen
export const unFreezeOpenSelector = state => state.runStatus.unFreezeOpen

export default runStatusSlice.reducer
