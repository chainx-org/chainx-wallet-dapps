import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Abi } from '@chainx/api-contract'
import styled from 'styled-components'

const InputWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  color: #000000;
  min-height: 40px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .label {
    height: 36px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  .body-area {
    display: flex;
    align-items: center;
    background: #f2f3f4;
    border: 1px solid #dce0e2;
    border-radius: 6px;
    min-height: 28px;
    width: 446px;
    padding: 10px;
    span {
      color: #545454;
      font-size: 14px;
    }
    .messages {
      display: flex;
      flex-direction: column;
    }
  }
`

export default function({ accept, file, setFile }) {
  const [contractAbi, setContractAbi] = useState({})
  const label =
    accept === 'wasm'
      ? 'Upload compiled contract wasm'
      : 'Upload contract abi json'
  const _onDrop = files => {
    const reader = new FileReader()

    reader.onabort = () => {}
    reader.onerror = () => {}

    reader.onload = e => {
      const fileString = e.target.result
      const data = new Uint8Array(fileString)
      const name = files[0].name
      if (accept === 'json') {
        try {
          const json = JSON.parse(fileString)
          setFile(json)
          if (json.contract) {
            const cb = new Abi(json)
            console.log('upload file new abi ', cb)
            setContractAbi(cb)
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        setFile({ name, size: files[0].size, data })
      }
    }
    if (accept === 'json') {
      reader.readAsText(files[0], 'UTF-8')
    } else {
      reader.readAsArrayBuffer(files[0])
    }
  }

  const getRenderFileInfo = () => {
    if (accept === 'wasm') {
      return file.name ? (
        <span>
          {file.name} ({file.size} bytes)
        </span>
      ) : (
        <span>
          drag or drop {accept} file here, or click to select the file
        </span>
      )
    } else if (accept === 'json') {
      return contractAbi.abi ? (
        <div className="messages">
          {contractAbi.abi.contract.messages.map((item, i) => (
            <span key={i}>
              {item.name}(
              {item.args
                .map(({ name, type }) => `${name}: ${type.displayName}`)
                .join(', ')}
              ){item.returnType ? ': ' + item.returnType.displayName : ''}
            </span>
          ))}
        </div>
      ) : (
        <span>
          drag or drop {accept} file here, or click to select the file
        </span>
      )
    }
  }

  return (
    <Dropzone accept={'.' + accept} onDrop={_onDrop} multiple={false}>
      {({ getRootProps, getInputProps }) => (
        <InputWithLabel {...getRootProps()}>
          <span className="label">{label}</span>
          <input {...getInputProps()} />
          <div className="body-area">{getRenderFileInfo()}</div>
        </InputWithLabel>
      )}
    </Dropzone>
  )
}
