import React, { useEffect } from 'react'
import Header from './Header'
import Validators from './Validators'
import { fetchIntentions } from '../../reducers/intentionSlice'
import { useDispatch } from 'react-redux'

export default function() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchIntentions())
  }, [dispatch])

  return (
    <div class="staking">
      <Header />
      <Validators />
    </div>
  )
}
