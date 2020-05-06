import { Dialog, PrimaryButton, TextInput } from '@chainx/ui'
import styled from 'styled-components'
import React, { useState } from 'react'
import UploadFile from './UploadFile'
import $t from '../../locale'
import { Abi } from '@chainx/api-contract'
import { isCodeHashExist } from '../../utils/contractHelper'
import store from 'store'
import { fetchAbiAndContractList } from '../../reducers/localSlice'
import { useDispatch } from 'react-redux'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;

    & > div:not(:first-of-type) {
      margin-top: 16px;
    }

    & > button {
      margin-top: 20px;
    }

    & > span.error {
      color: #de071c;
      font-size: 12px;
      margin-left: 8px;
    }
  }
`

export default function({ handleClose }) {
  const [codeHash, setCodeHash] = useState('')
  const [codeHashErrMsg, setCodeHashErrMsg] = useState('')

  const [name, setName] = useState('')
  const [nameErrMsg, setNameErrMsg] = useState('')

  const [abiErrMsg, setAbiErrMsg] = useState('')
  const [contractAbi, setContractAbi] = useState(null)

  const dispatch = useDispatch()

  const add = async () => {
    if (!codeHash) {
      setCodeHashErrMsg('Please input code hash')
      return
    }
    if (!name) {
      setNameErrMsg('Please input code bundle name')
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

    const existed = await isCodeHashExist(codeHash)
    if (!existed) {
      setAbiErrMsg('Code hash not existed on chain')
      return
    }

    store.set(`ABI_${codeHash}`, {
      name,
      codeHash,
      abi: contractAbi,
      parseAbi: parsedAbi
    })
    dispatch(fetchAbiAndContractList())
    handleClose()
  }

  return (
    <StyledDialog
      title="Add an existing code hash"
      open
      handleClose={handleClose}
    >
      <div className="wrapper">
        <TextInput
          value={codeHash}
          onChange={value => {
            setCodeHashErrMsg('')
            setCodeHash(value)
          }}
          placeholder="Code hash"
          error={!!codeHashErrMsg}
          errorText={codeHashErrMsg}
          showClear={false}
        />
        <TextInput
          value={name}
          onChange={value => {
            setNameErrMsg('')
            setName(value)
          }}
          placeholder="Code bundle name"
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

        <PrimaryButton size="fullWidth" onClick={add}>
          {$t('COMMON_CONFIRM')}
        </PrimaryButton>
      </div>
    </StyledDialog>
  )
}
