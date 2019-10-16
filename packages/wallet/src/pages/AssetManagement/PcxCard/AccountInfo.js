import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIntentions } from '../../../reducers/intentionSlice'
import { getChainx } from '../../../services/chainx'
import $t from '../../../locale'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  min-height: 72px;
`

const Title = styled.h5`
  margin: 0;
  opacity: 0.72;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0.1px;
  line-height: 28px;
`

const BaseRow = styled.p`
  margin: 0;
  opacity: 0.56;
  color: #000000;
`

const Address = styled(BaseRow)`
  font-size: 14px;
  line-height: 20px;
`

const Roles = styled.p`
  margin-top: 4px;
  font-size: 14px;
  line-height: 20px;
`

export default function() {
  const account = useSelector(state => state.address)
  const intentions = useSelector(state => state.intentions.intentions)
  const dispatch = useDispatch()

  const id = getChainx().account.decodeAddress(account.address, false)
  const validator = intentions.find(intention => intention.account === id)
  const isValidator = !!validator
  const isTrustee = validator && validator.isTrustee.length > 0

  const roles = []
  if (isTrustee) {
    roles.push($t('INTENTION_TRUSTEE'))
  }
  if (isValidator) {
    roles.push($t('INTENTION_VALIDATOR'))
  }

  useEffect(() => {
    dispatch(fetchIntentions())
  }, [dispatch])

  return (
    <Wrapper>
      <Title>{(account.name || '').toUpperCase()}</Title>
      <Address>{account.address}</Address>
      <Roles>{roles.join('、')}</Roles>
    </Wrapper>
  )
}
