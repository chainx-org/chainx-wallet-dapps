import { Dialog, PrimaryButton, TextInput } from '@chainx/ui'
import styled from 'styled-components'
import React, { useState } from 'react'
import UploadFile from './UploadFile'
import $t from '../../locale'
import { Abi } from '@chainx/api-contract'
import { isContractExist } from '../../utils/contractHelper'
import store from 'store'
import { fetchAbiAndContractList } from '../../reducers/localSlice'
import { useDispatch } from 'react-redux'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;

    & > span.error {
      color: #de071c;
      font-size: 12px;
      margin-left: 8px;
    }
  }
`

export default function({ handleClose, abi }) {
  const [address, setAddress] = useState('')
  const [addressErrMsg, setAddressErrMsg] = useState('')

  const [name, setName] = useState((abi && abi.name) || '')
  const [nameErrMsg, setNameErrMsg] = useState('')

  const [contractAbi, setContractAbi] = useState(null)
  const [abiErrMsg, setAbiErrMsg] = useState('')

  const dispatch = useDispatch()

  const add = async () => {
    if (!address) {
      setAddressErrMsg('Please input contract address')
      return
    }
    if (!(await isContractExist(address))) {
      setAddressErrMsg('Contract not exist on this address')
      return
    }
    if (!name) {
      setNameErrMsg('Please input contract name')
      return
    }
    if (!contractAbi) {
      setAbiErrMsg('Please select abi file')
      return
    }

    let parsedAbi = {}
    try {
      parsedAbi = new Abi(contractAbi)
    } catch (error) {
      console.log('parse abi error ', error)
      setAbiErrMsg('Parse ABI Error')
      return
    }

    const contract = {
      address: address,
      contract: { abi: contractAbi, parseAbi: parsedAbi },
      name: name
    }
    store.set('CONTRACT_' + address, contract)
    dispatch(fetchAbiAndContractList())
    handleClose()
  }

  return (
    <StyledDialog
      title="Add an existing contract"
      open
      handleClose={handleClose}
    >
      <div className="wrapper">
        <TextInput
          value={address}
          onChange={value => {
            setAddressErrMsg('')
            setAddress(value)
          }}
          placeholder="Contract address"
          error={!!addressErrMsg}
          errorText={addressErrMsg}
          showClear={false}
        />
        <TextInput
          style={{ marginTop: 16 }}
          value={name}
          onChange={value => {
            setNameErrMsg('')
            setName(value)
          }}
          placeholder="Contract name"
          error={!!nameErrMsg}
          errorText={nameErrMsg}
          showClear={false}
        />

        <UploadFile
          accept="json"
          file={contractAbi}
          setFile={value => {
            setAbiErrMsg('')
            setContractAbi(value)
          }}
        />
        <span className="error">{abiErrMsg}</span>

        <PrimaryButton style={{ marginTop: 20 }} size="fullWidth" onClick={add}>
          {$t('COMMON_CONFIRM')}
        </PrimaryButton>
      </div>
    </StyledDialog>
  )
}
