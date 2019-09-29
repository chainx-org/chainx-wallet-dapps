import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTest } from '../reducers/testSlice'
import Card from '../components/Card'

function Test() {
  const test = useSelector(state => state.test)
  const dispatch = useDispatch()

  return (
    <div className="App">
      <span>{test}</span>

      <Card>
        <button onClick={() => dispatch(setTest('hello'))}>
          Set text to hello
        </button>
      </Card>
    </div>
  )
}

export default Test
