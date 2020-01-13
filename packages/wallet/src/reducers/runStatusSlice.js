import { createSlice } from '@reduxjs/toolkit'

const runStatusSlice = createSlice({
  name: 'runStatus',
  initialState: {
    unNominateOpen: false,
    switchNominationOpen: false,
    voteOpen: false,
    voteIntention: null,
    unFreezeOpen: false,
    switchNominationData: {},
    unNominationData: {},
    unFreezeRecord: {},
    loading: false,
    openSignerDownloadDialog: false,
    openExtensionDownloadDialog: false
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
    },
    setSwitchNominationData(state, action) {
      state.switchNominationData = action.payload
    },
    setUnNominationData(state, action) {
      state.unNominationData = action.payload
    },
    setUnFreezeRecord(state, action) {
      state.unFreezeRecord = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setOpenSignerDownloadDialog(state, action) {
      state.openSignerDownloadDialog = action.payload
    },
    setOpenExtensionDownloadDialog(state, action) {
      state.openExtensionDownloadDialog = action.payload
    }
  }
})

export const {
  setUnNominateOpen,
  setSwitchNominationOpen,
  setVoteOpen,
  setUnFreezeOpen,
  setVoteIntention,
  setSwitchNominationData,
  setUnNominationData,
  setUnFreezeRecord,
  setLoading,
  setOpenSignerDownloadDialog,
  setOpenExtensionDownloadDialog
} = runStatusSlice.actions

export const unNominateOpenSelector = state => state.runStatus.unNominateOpen
export const switchNominationOpenSelector = state =>
  state.runStatus.switchNominationOpen
export const voteOpenSelector = state => state.runStatus.voteOpen
export const unFreezeOpenSelector = state => state.runStatus.unFreezeOpen
export const voteIntentionSelector = state => state.runStatus.voteIntention
export const switchNominationDataSelector = state =>
  state.runStatus.switchNominationData
export const unNominationDataSelector = state =>
  state.runStatus.unNominationData
export const unFreezeRecordSelector = state => state.runStatus.unFreezeRecord
export const loadingSelector = state => state.runStatus.loading
export const openSignerDownloadDialogSelector = state =>
  state.runStatus.openSignerDownloadDialog
export const openExtensionDownloadDialogSelector = state =>
  state.runStatus.openExtensionDownloadDialog

export default runStatusSlice.reducer
