import React from 'react'
import styled from 'styled-components'
import InputWithLabel from './InputWithLabel'
import { useSelector } from 'react-redux'
import { nameSelector, addressSelector } from '../../reducers/addressSlice'

const CurrentAccount = styled.div``

export default function() {
  const accountName = useSelector(nameSelector)
  const accountAddress = useSelector(addressSelector)

  return (
    <CurrentAccount>
      <InputWithLabel
        label={`Current account(${accountName})`}
        value={accountAddress}
        disabled={true}
      />
    </CurrentAccount>
  )
}
