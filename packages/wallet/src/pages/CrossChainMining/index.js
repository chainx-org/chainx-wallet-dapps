import React, { useEffect } from 'react'
import Xbtc from './XbtcCard'
import Lbtc from './LbtcCard'
import Sdot from './SdotCard'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { fetchPseduIntentions } from '../../reducers/intentionSlice'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  & > section:not(:first-of-type) {
    margin-top: 16px;
  }
`

export default function() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPseduIntentions())
  }, [dispatch])

  return (
    <Wrapper>
      <Xbtc />
      <Lbtc />
      <Sdot />
    </Wrapper>
  )
}
