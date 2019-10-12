import React, { useEffect } from 'react'
import Header from './Header'
import Validators from './Validators'
import {
  fetchIntentions,
  fetchSenators,
  fetchLogos
} from '../../reducers/intentionSlice'
import { useDispatch } from 'react-redux'
import { fetchAssetsInfo } from '../../reducers/assetSlice'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;

  & > main {
    flex: 1;
    padding: 0 16px;
  }
`

export default function() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchSenators())
    dispatch(fetchIntentions())
    dispatch(fetchAssetsInfo())
    dispatch(fetchLogos())
  }, [dispatch])

  return (
    <Wrapper className="staking">
      <Header />
      <Validators />
    </Wrapper>
  )
}
