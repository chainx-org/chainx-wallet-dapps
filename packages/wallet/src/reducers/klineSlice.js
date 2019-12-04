import { createSlice } from '@reduxjs/toolkit'
import { getApi } from '../services/api'
import moment from 'moment'
import { getSeconds } from '../utils'

const klineSlice = createSlice({
  name: 'kline',
  initialState: {
    data: [],
    type: 604800
  },
  reducers: {
    setData: (state, { payload }) => {
      state.data = payload
    }
  }
})

export const fetchKline = () => async dispatch => {
  const endDate = getSeconds(new Date())
  const startDate = getSeconds(
    moment(Date.now())
      .subtract(1000, 'week')
      .toDate()
  )
  const resp = await window.fetch(
    `${getApi()}kline/?pairid=0&type=604800&start_date=${startDate}&end_date=${endDate}`
  )

  const data = await resp.json()
  dispatch(setData(data))
}

export const klineDataSelector = state =>
  state.kline.data.map(d => ({
    ...d,
    date: new Date(d.time * 1000)
  }))

export const klineTypeSelector = state => state.kline.type

export const { setData } = klineSlice.actions

export default klineSlice.reducer
