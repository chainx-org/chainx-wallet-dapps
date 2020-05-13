import { createSlice } from '@reduxjs/toolkit'

let idCounter = 0

export const typeEnum = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
}

const types = Object.values(typeEnum)

const snackSlice = createSlice({
  name: 'snack',
  initialState: {
    snacks: []
  },
  reducers: {
    addSnack: {
      reducer(state, { payload: { id, type, title, message } }) {
        if (!types.includes(type)) {
          console.error('invalid snack type')
          return
        }

        state.snacks.push({ id, type, title, message })
      }
    },
    removeSnack(state, action) {
      const index = state.snacks.findIndex(
        snack => snack.id === action.payload.id
      )
      if (index >= 0) {
        state.snacks.splice(index, 1)
      }
    }
  }
})

export const generateId = () => {
  return idCounter++
}

export const snacksSelector = state => state.snack.snacks

export const addAutoCloseSnack = (dispatch, data, seconds = 5) => {
  dispatch(addSnack(data))
  removeSnackInSeconds(dispatch, data.id, seconds)
}

export const addAutoCloseSnackWithParams = (
  dispatch,
  type,
  title,
  message,
  seconds = 5
) => {
  const data = {}
  data.id = generateId()
  data.type = type
  data.title = title
  data.message = message || ''
  addAutoCloseSnack(dispatch, data, seconds)
}

export const removeSnackInSeconds = (dispatch, id, seconds = 0) => {
  setTimeout(() => {
    dispatch(removeSnack({ id }))
  }, seconds * 1000)
}

export const { addSnack, removeSnack } = snackSlice.actions

export default snackSlice.reducer
