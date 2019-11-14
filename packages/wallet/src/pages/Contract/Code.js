import React, { useState, useEffect } from 'react'
import { PrimaryButton, DefaultButton } from '@chainx/ui'
import { Abi } from '@chainx/api-contract'
import DeployContract from '../../components/Contract/DeployContract'
import UploadContract from '../../components/Contract/UploadContract'
import ContractCard from '../../components/Contract/ContractCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAbiAndContractList } from '../../reducers/localSlice'
import { isCodeHashExist, uploadContract } from '../../utils/contractHelper'
import store from 'store'
import {
  typeEnum,
  addAutoCloseSnackWithParams
} from '../../reducers/snackSlice'

function Code(props) {
  const [showUpload, setShowUpload] = useState(false)
  const [showDeploy, setShowDeploy] = useState(false)
  const [abi, setAbi] = useState({ abi: { messages: [] } })
  const [update, setUpdate] = useState(new Date())
  const [isnew, setIsnew] = useState(true)

  const { abiList } = useSelector(state => state.local)
  const dispatch = useDispatch()
  let storeAbi = {}

  useEffect(() => {
    dispatch(fetchAbiAndContractList())
  }, [update, dispatch])

  const upload = async (file, name, abi, gas, codeHash, isnew) => {
    console.log('upload wasm', file, name, abi, gas, codeHash, isnew)
    const paramsList = [file.size, name, gas, abi.contract]
    const errMsgList = [
      '请上传 wasm 文件',
      '请输入 name',
      '请输入 gas',
      '请上传 ABI 文件'
    ]
    for (let i in paramsList) {
      if (i === '0' ? isnew && !paramsList[i] : !paramsList[i]) {
        addAutoCloseSnackWithParams(dispatch, typeEnum.ERROR, errMsgList[i])
        return
      }
    }
    let parseAbi = {}
    try {
      parseAbi = new Abi(abi)
    } catch (error) {
      console.log('parse abi error ', error)
      addAutoCloseSnackWithParams(
        dispatch,
        typeEnum.ERROR,
        'Parse ABI Error',
        error.message || error.msg
      )
      return
    }
    storeAbi = {
      name: name,
      codeHash: codeHash,
      abi: abi,
      parseAbi: parseAbi
    }
    if (!isnew) {
      if (await isCodeHashExist(codeHash)) {
        addAutoCloseSnackWithParams(dispatch, typeEnum.SUCCESS, '添加 ABI 成功')
        saveAbi()
      } else {
        addAutoCloseSnackWithParams(dispatch, typeEnum.ERROR, 'CodeHash 不存在')
      }
      return
    }
    uploadContract(file, gas, cb)
  }

  const cb = resp => {
    if (resp.reject) {
      console.log('tx was rejected')
      addAutoCloseSnackWithParams(dispatch, typeEnum.ERROR, '交易被拒绝')
      return
    }
    if (resp.err) {
      console.log('error occurs ', resp.err)
      addAutoCloseSnackWithParams(
        dispatch,
        typeEnum.ERROR,
        '交易失败',
        resp.err.message
      )
    } else {
      const result = resp.status
      console.log(result)
      let type = typeEnum.SUCCESS
      let title = '合约上传成功'
      if (result.status === 'Broadcast') {
        addAutoCloseSnackWithParams(dispatch, type, '交易已发送')
      } else if (result.status === 'Finalized') {
        if (result.result === 'ExtrinsicSuccess') {
          const event =
            result.events &&
            result.events.find(item => {
              return item.method === 'CodeStored'
            })
          const codeHash = event.event.data[0]
          storeAbi.codeHash = codeHash
          saveAbi()
        } else {
          type = typeEnum.ERROR
          title = '合约上传失败'
        }
        addAutoCloseSnackWithParams(dispatch, type, title)
      }
    }
  }

  const saveAbi = () => {
    store.set('ABI_' + storeAbi.codeHash, storeAbi)
    setShowUpload(false)
    setUpdate(new Date())
  }

  const clickUpload = type => {
    setIsnew(type)
    setShowUpload(true)
  }

  return (
    <div className="code">
      {showDeploy && (
        <DeployContract
          props={props}
          abi={abi}
          setShowDeploy={setShowDeploy}
          setUpdate={setUpdate}
        />
      )}
      {showUpload && (
        <UploadContract
          upload={upload}
          setShowUpload={setShowUpload}
          isnew={isnew}
        />
      )}
      <div className="button-area">
        <PrimaryButton
          className="wide-button"
          onClick={() => clickUpload(true)}
        >
          Upload WASM
        </PrimaryButton>
        <DefaultButton
          className="wide-button last-button"
          onClick={() => clickUpload(false)}
        >
          Add existing code hash
        </DefaultButton>
      </div>
      {abiList.length > 0 ? (
        abiList.map((item, i) => (
          <ContractCard
            key={i}
            item={item}
            setAbi={setAbi}
            setShowDeploy={setShowDeploy}
            setUpdate={setUpdate}
            type="ABI"
          />
        ))
      ) : (
        <div className="no-data">
          <span>No contract code available</span>
        </div>
      )}
    </div>
  )
}

export default Code
