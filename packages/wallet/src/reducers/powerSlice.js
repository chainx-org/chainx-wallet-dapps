import { createSlice } from '@reduxjs/toolkit'
import { getApi } from '../services/api'

const powerSlice = createSlice({
  name: 'power',
  initialState: {
    power: {},
    status: {}
  },
  reducers: {
    setPower: {
      reducer(state, action) {
        state.power = action.payload
      }
    },
    setStatus: {
      reducer(state, action) {
        state.status = action.payload
      }
    }
  }
})

export const powerSelector = state => state.power.power
export const statusSelector = state => state.power.status

export const { setPower, setStatus } = powerSlice.actions

export const fetchPower = () => async dispatch => {
  const resp = await window.fetch(`${getApi()}power_percent`)
  const data = await resp.json()
  dispatch(
    setPower({
      'S-DOT': data.find(({ token }) => token === 'SDOT').power,
      'X-BTC': data.find(({ token }) => token === 'X-BTC').power,
      'L-BTC': data.find(({ token }) => token === 'L-BTC').power,
      PCX: data.find(({ token }) => token === 'PCX').power
    })
  )
}

export const fetchChainStatus = () => async dispatch => {
  const resp = await window.fetch(`${getApi()}chain/status`)
  const data = await resp.json()
  dispatch(setStatus(data))
}

export default powerSlice.reducer
