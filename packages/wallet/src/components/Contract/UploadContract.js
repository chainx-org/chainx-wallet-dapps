import React, { useState, useEffect } from 'react'
import UploadFile from './UploadFile'
import Confirm from './Confirm'
import InputWithLabel from './InputWithLabel'

export default function({ upload, setShowUpload, isnew = true }) {
  const [file, setFile] = useState({})
  const [contractAbi, setContractAbi] = useState({})
  const [gas, setGas] = useState(20000000)
  const [name, setName] = useState('')
  const [codeHash, setCodeHash] = useState('')

  useEffect(() => {
    setName(file.name)
  }, [file])

  const title = isnew ? 'Upload WASM' : 'Add an existing code hash'

  return (
    <div className="upload">
      <Confirm
        title={title}
        cancel={() => setShowUpload(false)}
        confirm={() => upload(file, name, contractAbi, gas, codeHash, isnew)}
      >
        <div className="upload-area">
          {isnew && (
            <>
              <InputWithLabel
                label="Deploy account"
                value="Alice 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehX"
                disabled={true}
              />
              <UploadFile accept="wasm" file={file} setFile={setFile} />
            </>
          )}
          {!isnew && (
            <InputWithLabel
              label="Code hash"
              value={codeHash || ''}
              onChange={e => setCodeHash(e.target.value)}
            />
          )}
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
          {isnew && (
            <InputWithLabel
              label="Maximum gas allowed"
              value={gas}
              onChange={e => setGas(e.target.value)}
              type="number"
            />
          )}
        </div>
      </Confirm>
    </div>
  )
}
