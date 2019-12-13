import { createSlice } from '@reduxjs/toolkit'

const runStatusSlice = createSlice({
  name: 'runStatus',
  initialState: {
    unNominateOpen: false,
    switchNominationOpen: false,
    voteOpen: false,
    voteIntention: null,
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
    },
    setVoteIntention(state, action) {
      state.voteIntention = action.payload
    }
  }
})

export const {
  setUnNominateOpen,
  setSwitchNominationOpen,
  setVoteOpen,
  setUnFreezeOpen,
  setVoteIntention
} = runStatusSlice.actions

export const unNominateOpenSelector = state => state.runStatus.unNominateOpen
export const switchNominationOpenSelector = state =>
  state.runStatus.switchNominationOpen
export const voteOpenSelector = state => state.runStatus.voteOpen
export const unFreezeOpenSelector = state => state.runStatus.unFreezeOpen
export const voteIntentionSelector = state => state.runStatus.voteIntention

export default runStatusSlice.reducer
