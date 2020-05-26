import { createSlice } from '@reduxjs/toolkit'
import { getApi } from '../services/api'

const powerSlice = createSlice({
  name: 'power',
  initialState: {
    power: [],
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
  const resp = await window.fetch(`${getApi()}power_percent_v2`)
  const data = await resp.json()
  dispatch(setPower(data))
}

export const fetchChainStatus = () => async dispatch => {
  const resp = await window.fetch(`${getApi()}chain/status`)
  const data = await resp.json()
  dispatch(setStatus(data))
}

export const powerObjectSelector = state => {
  const powerArr = state.power.power

  return powerArr.reduce((result, p) => {
    result[p.name] = p.power
    return result
  }, {})
}

export default powerSlice.reducer
