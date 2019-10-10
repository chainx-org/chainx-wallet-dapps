import React, { useEffect } from 'react'
import Header from './Header'
import Validators from './Validators'
import { fetchIntentions } from '../../reducers/intentionSlice'
import { useDispatch } from 'react-redux'
import { fetchAssetsInfo } from '../../reducers/assetSlice'

export default function() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchIntentions())
    dispatch(fetchAssetsInfo())
  }, [dispatch])

  return (
    <div className="staking">
      <Header />
      <Validators />
    </div>
  )
}
