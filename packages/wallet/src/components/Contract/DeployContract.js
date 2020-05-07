import React, { useState } from 'react'
import Confirm from './Confirm'
import InputWithLabel from './InputWithLabel'
import { deploy } from '../../utils/contractHelper'
import { useDispatch } from 'react-redux'
import {
  addAutoCloseSnackWithParams,
  typeEnum
} from '../../reducers/snackSlice'
import store from 'store'
import { showSnack } from '../../utils/chainxProvider'

export default function({ props, abi, setShowDeploy, setUpdate }) {
  const [name, setName] = useState((abi && abi.name) || '')
  const [params, setParams] = useState(
    abi && Array(abi.parseAbi.abi.contract.constructors[0].args.length).fill('')
  )
  const [endowment, setEndowment] = useState(0)
  const [gas, setGas] = useState(5000000)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const _deploy = async (abi, name, params, endowment, gas) => {
    console.log('deploy contract ', abi, name, params, endowment, gas)
    if (abi.parseAbi.abi.contract.constructors[0].args.length > params.length) {
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
    setLoading(true)
    try {
      const status = await deploy(abi, params, endowment, gas)
      console.log('status', status)

      const messages = {
        successTitle: 'Success',
        failTitle: 'Fail',
        successMessage: 'Success to deploy contract',
        failMessage: 'Fail to deploy contract'
      }

      await showSnack(status, messages, dispatch)
      const event =
        status.events &&
        status.events.find(item => {
          return item.method === 'Instantiated'
        })
      if (event) {
        // event name "Instantiated", data[0] 为发送人地址，data[1] 为合约地址
        const address = event.event.data[1]
        saveContract(address, abi)
      }
    } catch (e) {
      if (e) {
        console.error(e)
      }
      setLoading(false)
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
    props.history.push('/contract')
  }

  return (
    <div className="upload">
      <Confirm
        title="Deploy a new contract"
        cancel={() => setShowDeploy(false)}
        confirm={() => _deploy(abi, name, params, endowment, gas)}
        loading={loading}
      >
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
                const newParams = Array.from(params)
                const newValue = e.target.value
                newParams.splice(i, 1, newValue)
                setParams(newParams)
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
      </Confirm>
    </div>
  )
}
