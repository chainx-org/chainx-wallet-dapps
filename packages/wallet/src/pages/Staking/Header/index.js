import React from 'react'
import styled from 'styled-components'
import AccountNomination from './AccountNomination'
import Register from './Register'
import { useSelector } from 'react-redux'
import { validatorsSelector } from '@reducers/validatorSlice'
import { addressSelector } from '@reducers/addressSlice'

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid #dce0e2;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

export default function() {
  const address = useSelector(addressSelector)
  const validators = useSelector(validatorsSelector)
  const isValidator = validators.find(v => v.account === address)

  return (
    <Wrapper>
      <Left>
        {/*<NominationInfo />*/}
        {/*{isIntention ? <Update /> : <Register />}*/}
        {!isValidator && <Register />}
      </Left>
      <AccountNomination />
    </Wrapper>
  )
}
