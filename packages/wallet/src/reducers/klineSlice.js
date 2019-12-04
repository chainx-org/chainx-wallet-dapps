import { createSlice, createSelector } from '@reduxjs/toolkit'
import { getApi } from '../services/api'
import moment from 'moment'
import { getSeconds } from '../utils'
import { currentPairIdSelector } from './tradeSlice'

const klineSlice = createSlice({
  name: 'kline',
  initialState: {
    data: {},
    type: 604800
  },
  reducers: {
    setData: (state, { payload: { pairId, type, data } }) => {
      if (!state.data[pairId]) {
        state.data[pairId] = {}
      }

      state.data[pairId][type] = data
    },
    setType: (state, { payload }) => {
      state.type = payload
    }
  }
})

function getStartDate(type) {
  const now = moment(Date.now())
  if (type <= 60) {
    return now.subtract(1000, 'minutes').toDate()
  } else if (type <= 300) {
    return now.subtract(3000, 'minutes').toDate()
  } else if (type <= 1800) {
    return now.subtract(500, 'hours').toDate()
  } else {
    return now.subtract(500, 'days').toDate()
  }
}

export const fetchKline = (pairId = 0, type = 604800) => async dispatch => {
  const endDate = getSeconds(new Date())
  const startDate = getSeconds(getStartDate(type))
  const resp = await window.fetch(
    `${getApi()}kline/?pairid=${pairId}&type=${type}&start_date=${startDate}&end_date=${endDate}`
  )

  const data = await resp.json()
  dispatch(setData({ pairId, type, data }))
}

export const klineDataSelector = state => state.kline.data

export const klineTypeSelector = state => state.kline.type

export const candlesSelector = createSelector(
  klineDataSelector,
  currentPairIdSelector,
  klineTypeSelector,
  (klineData, pairId, type) => {
    if (!klineData[pairId]) {
      return []
    }

    if (!klineData[pairId][type]) {
      return []
    }

    return klineData[pairId][type]
  }
)

export const { setData, setType } = klineSlice.actions

export default klineSlice.reducer
