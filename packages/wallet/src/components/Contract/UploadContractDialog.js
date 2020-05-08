import { Dialog, PrimaryButton, TextInput } from '@chainx/ui'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import UploadFile from './UploadFile'
import $t from '../../locale'
import { Abi } from '@chainx/api-contract'
import { getChainx } from '../../services/chainx'
import { blake2AsU8a } from '@chainx/util-crypto'
import { isCodeHashExist } from '../../utils/contractHelper'
import { showSnack, signAndSendExtrinsic } from '../../utils/chainxProvider'
import { addressSelector } from '../../reducers/addressSlice'
import { store } from '../../index'
import { useDispatch } from 'react-redux'
import localStore from 'store'
import { fetchAbiAndContractList } from '../../reducers/localSlice'
import { compactAddLength } from '@chainx/util'
import LabelAmountInput from './LabelAmountInput'

const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;

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
  const [file, setFile] = useState(null)
  const [fileErrMsg, setFileErrMsg] = useState('')
  const [contractAbi, setContractAbi] = useState(null)
  const [abiErrMsg, setAbiErrMsg] = useState('')
  const [gas, setGas] = useState(20000000)
  const [name, setName] = useState('')
  const [nameErrMsg, setNameErrMsg] = useState('')
  const accountAddress = addressSelector(store.getState())

  const dispatch = useDispatch()

  useEffect(() => {
    if (file) {
      setName(file.name)
    }
  }, [file])

  const upload = async () => {
    if (!file) {
      setFileErrMsg('Please select wasm file')
      return
    }
    if (!contractAbi) {
      setAbiErrMsg('Please select abi file')
      return
    }
    if (!name) {
      setNameErrMsg('Please input code bundle name')
      return
    }
    const codeHash = blake2AsU8a(file.data).reduce((result, i) => {
      return result + ('0' + i.toString(16)).slice(-2)
    }, '0x')
    const existed = await isCodeHashExist(codeHash)
    if (existed) {
      setAbiErrMsg('Code hash already existed on chain')
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

    const args = [gas, compactAddLength(file.data)]
    const ex = getChainx().api.tx.xContracts['putCode'](...args)

    const status = await signAndSendExtrinsic(accountAddress, ex.toHex())

    const messages = {
      successTitle: 'Success',
      failTitle: 'Fail',
      successMessage: 'Success to upload contract',
      failMessage: 'Fail to upload contract'
    }

    await showSnack(status, messages, dispatch)
    handleClose()
    localStore.set(`ABI_${codeHash}`, {
      name,
      codeHash,
      abi: contractAbi,
      parseAbi: parsedAbi
    })
    dispatch(fetchAbiAndContractList())
    handleClose()
  }

  return (
    <StyledDialog title="Upload WASM" open handleClose={handleClose}>
      <div className="wrapper">
        <UploadFile accept="wasm" file={file} setFile={setFile} />
        {fileErrMsg && <span className="error">{fileErrMsg}</span>}
        <TextInput
          style={{ marginTop: 16 }}
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
        <UploadFile accept="json" file={contractAbi} setFile={setContractAbi} />
        {abiErrMsg && <span className="error">{abiErrMsg}</span>}
        <LabelAmountInput
          label="Maximum gas allowed"
          value={gas}
          onChange={setGas}
        />
        <PrimaryButton size="fullWidth" onClick={upload}>
          {$t('COMMON_CONFIRM')}
        </PrimaryButton>
      </div>
    </StyledDialog>
  )
}
