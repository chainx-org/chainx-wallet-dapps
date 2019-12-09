import { createSlice } from '@reduxjs/toolkit'

const runStatusSlice = createSlice({
  name: 'runStatus',
  initialState: {
    unNominateOpen: false,
    switchNominationOpen: false,
    voteOpen: false
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
    }
  }
})

export const {
  setUnNominateOpen,
  setSwitchNominationOpen,
  setVoteOpen
} = runStatusSlice.actions

export const unNominateOpenSelector = state => state.runStatus.unNominateOpen
export const switchNominationOpenSelector = state =>
  state.runStatus.switchNominationOpen
export const voteOpenSelector = state => state.runStatus.voteOpen

export default runStatusSlice.reducer
