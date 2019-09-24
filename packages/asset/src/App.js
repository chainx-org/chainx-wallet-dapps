import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTest } from './reducers/testSlice'

function App() {
  const test = useSelector(state => state.test)
  const dispatch = useDispatch()

  return (
    <div className="App">
      <span>{test}</span>

      <button onClick={() => dispatch(setTest('hello'))}>
        Set text to hello
      </button>
    </div>
  )
}

export default App
