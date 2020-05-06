import React, { useState, useEffect } from 'react'
import UploadFile from './UploadFile'
import Confirm from './Confirm'
import InputWithLabel from './InputWithLabel'
import CurrentAccount from './CurrentAccount'

export default function({ upload, setShowUpload, loading }) {
  const [file, setFile] = useState({})
  const [contractAbi, setContractAbi] = useState({})
  const [gas, setGas] = useState(20000000)
  const [name, setName] = useState('')
  const [codeHash] = useState('')

  useEffect(() => {
    setName(file.name)
  }, [file])

  const title = 'Upload WASM'

  return (
    <div className="upload">
      <Confirm
        title={title}
        cancel={() => setShowUpload(false)}
        confirm={() => upload(file, name, contractAbi, gas, codeHash, true)}
        loading={loading}
      >
        <div className="upload-area">
          <>
            <CurrentAccount />
            <UploadFile accept="wasm" file={file} setFile={setFile} />
          </>
          <InputWithLabel
            label="Code bundle name"
            value={name || ''}
            onChange={e => setName(e.target.value)}
          />
          <UploadFile
            accept="json"
            file={contractAbi}
            setFile={setContractAbi}
          />
          <InputWithLabel
            label="Maximum gas allowed"
            value={gas}
            onChange={e => setGas(e.target.value)}
            type="number"
          />
        </div>
      </Confirm>
    </div>
  )
}
