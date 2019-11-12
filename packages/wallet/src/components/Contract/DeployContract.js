import React, { useState } from 'react'
import { Abi } from '@chainx/api-contract'
import UploadFile from './UploadFile'
import Confirm from './Confirm'
import InputWithLabel from './InputWithLabel'
import { deploy, isContractExist } from '../../utils/contractHelper'
import { useDispatch } from 'react-redux'
import {
  typeEnum,
  addAutoCloseSnackWithParams
} from '../../reducers/snackSlice'
import store from 'store'

export default function({
  props,
  abi,
  setShowDeploy,
  setUpdate,
  isnew = true
}) {
  const [name, setName] = useState((abi && abi.name) || '')
  const [address, setAddress] = useState('')
  const [params, setParams] = useState(
    abi &&
      Array.from(abi.parseAbi.abi.contract.constructors[0].args.length).fill('')
  )
  const [endowment, setEndowment] = useState(0)
  const [gas, setGas] = useState(500000)
  const [file, setFile] = useState({})

  const dispatch = useDispatch()

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
      console.log(resp.status)
      const result = resp.status
      let type = typeEnum.SUCCESS
      let title = '合约部署成功'
      if (result.status === 'Broadcast') {
        addAutoCloseSnackWithParams(dispatch, type, '交易已发送')
      } else if (result.status === 'Finalized') {
        if (result.result === 'ExtrinsicSuccess') {
          const event =
            result.events &&
            result.events.find(item => {
              return item.method === 'Instantiated'
            })
          if (event) {
            // event name "Instantiated", data[0] 为发送人地址，data[1] 为合约地址
            const address = event.event.data[1]
            saveContract(address, abi)
          }
        } else {
          type = typeEnum.ERROR
          title = '合约部署失败'
        }
        addAutoCloseSnackWithParams(dispatch, type, title)
      }
    }
  }

  const _deploy = async (abi, name, params, endowment, gas) => {
    console.log('deploy contract ', abi, name, params, endowment, gas)
    if (isnew) {
      if (
        abi.parseAbi.abi.contract.constructors[0].args.length > params.length
      ) {
        addAutoCloseSnackWithParams(
          dispatch,
          typeEnum.ERROR,
          '请输入构造函数参数'
        )
        return
      }
      for (let i in params) {
        if (!params[i]) {
          addAutoCloseSnackWithParams(
            dispatch,
            typeEnum.ERROR,
            '请输入构造函数参数'
          )
          return
        }
      }
      const paramsList = [abi, endowment, gas]
      const errMsgList = ['请上传 ABI 文件', '请输入 endowment', '请输入 gas']
      for (let i in paramsList) {
        if (!paramsList[i] && paramsList[i] !== 0) {
          addAutoCloseSnackWithParams(dispatch, typeEnum.ERROR, errMsgList[i])
          return
        }
      }
      deploy(abi, params, endowment, gas, cb)
    } else {
      let type = typeEnum.SUCCESS
      let title = '添加成功'
      if (await isContractExist(address)) {
        console.log('contract address exist')
        if (Object.keys(file).length < 1) {
          console.log('need abi')
          type = typeEnum.ERROR
          title = '请上传 ABI 文件'
        } else {
          saveContract(address, { abi: file, parseAbi: new Abi(file) })
        }
      } else {
        type = typeEnum.ERROR
        title = 'Contract address not exist'
        console.log('contract address not exist')
      }
      addAutoCloseSnackWithParams(dispatch, type, title)
    }
  }

  const saveContract = (address, _abi) => {
    const contract = {
      address: address,
      contract: _abi,
      name: name
    }
    store.set('CONTRACT_' + address, contract)
    setShowDeploy(false)
    setUpdate(new Date())
    props.history.push('/')
  }

  const title = isnew ? 'Deploy a new contract' : 'Add an existing contract'

  return (
    <div className="upload">
      <Confirm
        title={title}
        cancel={() => setShowDeploy(false)}
        confirm={() => _deploy(abi, name, params, endowment, gas)}
      >
        {isnew && (
          <>
            <InputWithLabel
              label="Deploy account"
              value="Alice 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehX"
              disabled={true}
            />
            <InputWithLabel
              label="Code hash for this contract"
              value={abi.codeHash}
              disabled={true}
            />
            <InputWithLabel
              label="Contract name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div className="constructor-area">
              <span className="label">Constructor params</span>
              {abi.parseAbi.abi.contract.constructors[0].args.map((item, i) => (
                <input
                  key={i}
                  type="text"
                  value={params[i]}
                  onChange={e => {
                    params[i] = e.target.value
                    setParams(params)
                  }}
                  placeholder={
                    abi.parseAbi.abi.contract.constructors[0].args[i].name +
                    ': ' +
                    abi.parseAbi.abi.contract.constructors[0].args[i].type
                      .displayName
                  }
                />
              ))}
            </div>
            <InputWithLabel
              label="Endowment"
              value={endowment}
              onChange={e => setEndowment(e.target.value)}
              type="number"
            />
            <InputWithLabel
              label="Maximum gas allowed"
              value={gas}
              onChange={e => setGas(e.target.value)}
              type="number"
            />
          </>
        )}
        {!isnew && (
          <>
            <InputWithLabel
              label="Contract address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <InputWithLabel
              label="Contract name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <UploadFile accept="json" file={file} setFile={setFile} />
          </>
        )}
      </Confirm>
    </div>
  )
}
