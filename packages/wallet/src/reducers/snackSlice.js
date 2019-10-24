import { createSlice } from 'redux-starter-kit'

let idCounter = 0

const types = ['success', 'info', 'warning', 'error']

const snackSlice = createSlice({
  slice: 'snack',
  initialState: {
    snacks: []
  },
  reducers: {
    addSnack: {
      reducer(
        state,
        {
          payload: { id, type, title, message }
        }
      ) {
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

export const { addSnack, removeSnack } = snackSlice.actions

export default snackSlice.reducer
