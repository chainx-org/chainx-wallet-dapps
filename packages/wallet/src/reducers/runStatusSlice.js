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
    switchNominationFrom: null,
    unNominationData: {},
    unFreezeRecord: {},
    unFreezeData: null,
    loading: false,
    openSignerDownloadDialog: false,
    openExtensionDownloadDialog: false,
    loadingIntentions: false,
    openBetBtcDialog: false,
    betOdd: true
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
    setSwitchNominationFrom(state, { payload }) {
      state.switchNominationFrom = payload
    },
    setUnNominationData(state, action) {
      state.unNominationData = action.payload
    },
    setUnFreezeRecord(state, action) {
      state.unFreezeRecord = action.payload
    },
    setUnFreezeData(state, { payload }) {
      state.unFreezeData = payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setOpenSignerDownloadDialog(state, action) {
      state.openSignerDownloadDialog = action.payload
    },
    setOpenExtensionDownloadDialog(state, action) {
      state.openExtensionDownloadDialog = action.payload
    },
    setLoadingIntentions(state, action) {
      state.loadingIntentions = action.payload
    },
    setOpenBetBtcDialog(state, action) {
      state.openBetBtcDialog = action.payload.open
      state.betOdd = action.payload.betOdd
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
  setSwitchNominationFrom,
  setUnNominationData,
  setUnFreezeRecord,
  setLoading,
  setOpenSignerDownloadDialog,
  setOpenExtensionDownloadDialog,
  setLoadingIntentions,
  setOpenBetBtcDialog,
  setUnFreezeData
} = runStatusSlice.actions

export const openVoteDialog = open => dispatch => {
  dispatch(setVoteOpen(open))
}

export const unFreezeDataSelector = state => state.runStatus.unFreezeData
export const switchNominationFromSelector = state =>
  state.runStatus.switchNominationFrom
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
export const loadingIntentionsSelector = state =>
  state.runStatus.loadingIntentions
export const openBetBetDialogSelector = state =>
  state.runStatus.openBetBtcDialog
export const betOddSelector = state => state.runStatus.betOdd

export default runStatusSlice.reducer
