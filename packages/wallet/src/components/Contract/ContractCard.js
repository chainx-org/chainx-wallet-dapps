import React, { useState } from 'react'
import store from 'store'
import { useDispatch } from 'react-redux'
import {
  generateId,
  typeEnum,
  addAutoCloseSnack,
  addAutoCloseSnackWithParams,
  removeSnackInSeconds
} from '../../reducers/snackSlice'
import { PrimaryButton } from '@chainx/ui'
import Draggable from 'react-draggable'
import ExecuteMessageItem from './ExecuteMessageItem'
import Confirm from './Confirm'
import InputWithLabel from './InputWithLabel'
import { call, send } from '../../utils/contractHelper'
import closeGrayIcon from '../../static/close_gray.svg'
import closeIcon from '../../static/close.svg'
import deleteIcon from '../../static/delete.svg'
import deployIcon from '../../static/deploy.svg'
import ClipBoard from '../ClipBoard'

export default function(props) {
  const { item, setAbi, setShowDeploy, setUpdate, type } = props
  const [contractItem, setContractItem] = useState({})
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResultArea, setShowResultArea] = useState(false)
  const [result, setResult] = useState([])
  const [params, setParams] = useState([])
  const [gasLimit, setGasLimit] = useState(500000)
  const [value, setValue] = useState(0)

  const dispatch = useDispatch()

  const deleteAbi = () => {
    const key = type + '_' + (item.codeHash || item.address)
    store.remove(key)
    const title = '删除成功'
    addAutoCloseSnackWithParams(dispatch, typeEnum.SUCCESS, title)
    setShowConfirm(false)
    setUpdate(new Date())
  }

  const deployAbi = item => {
    setAbi(item)
    setShowDeploy(true)
  }

  const clickContractItem = item => {
    const paramsArray =
      item.args && item.args.length > 0
        ? new Array(item.args.length).fill('')
        : []
    setContractItem(item)
    setParams(paramsArray)
    showConfirmAction(false)
  }

  const showConfirmAction = status => {
    setShowConfirm(status)
    setShowSubmitForm(!status)
  }

  const closeSubmitForm = () => {
    setShowSubmitForm(false)
    setContractItem({})
  }

  const getOrderMessages = (item, type) => {
    const callMessages = []
    const sendMessages = []
    let messages = []
    if (type === 'ABI') {
      messages = item.parseAbi.abi.contract.messages
    } else {
      messages = item.contract.parseAbi.abi.contract.messages
    }
    messages.forEach(msg => {
      if (msg.mutates) {
        sendMessages.push(msg)
      } else {
        callMessages.push(msg)
      }
    })
    return callMessages.concat(sendMessages)
  }

  const click = async () => {
    let missingParams = false
    let missingItem = {}
    const message = contractItem
    for (let i in message.args) {
      if (!params[i]) {
        missingParams = true
        missingItem = message.args[i]
        break
      }
    }
    if (missingParams) {
      const type = typeEnum.ERROR
      const title = '此项必填'
      const _message = '请填写 ' + missingItem.name
      addAutoCloseSnackWithParams(dispatch, type, title, _message)
      return
    }
    console.log('click ', item, message, params)
    let type = typeEnum.SUCCESS
    let title = '合约执行'
    let _message = '交易已发送'
    const id = generateId()
    if (message.mutates) {
      console.log('send methods')
      const data = await send(
        item.contract.abi,
        item.address,
        message.name,
        params,
        value,
        gasLimit,
        resp => {
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
              resp.err.message || resp.err.msg
            )
          } else {
            const _result = resp.status
            console.log(_result)
            if (_result.status === 'Broadcast') {
              addAutoCloseSnack(dispatch, {
                id,
                type,
                title,
                message: _message
              })
              // addAutoCloseSnackWithParams(dispatch, type, title, _message)
            } else if (_result.status === 'Finalized') {
              removeSnackInSeconds(dispatch, id)
              if (_result.result === 'ExtrinsicSuccess') {
                _message = '合约执行成功，可在列表内查看。'
                result.push({
                  name: message.name,
                  result: JSON.stringify(_result)
                })
                setResult(Array.from(result))
                setShowResultArea(true)
              } else {
                type = typeEnum.ERROR
                _message = '合约执行失败'
              }
              addAutoCloseSnackWithParams(dispatch, type, title, _message)
            }
          }
        }
      )
      if (!data.status) {
        type = typeEnum.ERROR
        title = '调用失败'
        _message = data.result
        addAutoCloseSnackWithParams(dispatch, type, title, _message)
      }
    } else {
      console.log('call methods')
      title = '调用成功'
      _message = ''
      const data = await call(
        item.contract.abi,
        item.address,
        message.name,
        gasLimit,
        params
      )
      if (!data.status) {
        type = typeEnum.ERROR
        title = '调用失败'
        _message = data.result
      } else {
        result.push({ name: message.name, result: data.result })
        setResult(Array.from(result))
      }
      addAutoCloseSnackWithParams(dispatch, type, title, _message)

      if (result.length > 0) {
        setShowResultArea(true)
      }
    }
    setShowSubmitForm(false)
  }

  return (
    <div className="contract-card">
      {showConfirm && (
        <Confirm
          title="This action will delete current contract"
          confirm={() => deleteAbi()}
          cancel={() => setShowConfirm(false)}
        />
      )}
      {showSubmitForm && (
        <Draggable cancel=".not-draggable">
          <div className="contract-call-form">
            <div className="contract-call-form-header">
              <span>{contractItem.name}</span>
              <img
                src={closeGrayIcon}
                alt="closeIcon"
                onClick={() => closeSubmitForm()}
              />
            </div>
            {contractItem.args &&
              contractItem.args.map(({ name, type }, index) => (
                <InputWithLabel
                  key={index}
                  label={name}
                  placeholder={`${name}: ${type.displayName}`}
                  value={params[index]}
                  onChange={e => {
                    params[index] = e.target.value
                    setParams(Array.from(params))
                  }}
                />
              ))}
            <InputWithLabel
              label="gasLimit"
              placeholder="gasLimit: u64"
              value={gasLimit}
              onChange={e => setGasLimit(e.target.value)}
            />
            {contractItem.mutates && (
              <InputWithLabel
                label="value(PCX)"
                placeholder="value: Balance"
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            )}
            <PrimaryButton onClick={click} className="contract-submit-button">
              Execute
            </PrimaryButton>
          </div>
        </Draggable>
      )}
      <div className="contract-card-main">
        <div className="header">
          <div className="left">
            <div className="name">
              <span className="contract-name">{item.name}</span>
              <ClipBoard>{item.address || item.codeHash}</ClipBoard>
            </div>
          </div>
          <div className="action-area">
            <div
              className="delete-action"
              onClick={() => showConfirmAction(true)}
            >
              <img src={deleteIcon} alt="delete-icon" />
              <span>Delete</span>
            </div>
            {type === 'ABI' && (
              <div className="deploy-action" onClick={() => deployAbi(item)}>
                <img src={deployIcon} alt="deploy-icon" />
                <span>Deploy</span>
              </div>
            )}
          </div>
        </div>
        <div className="messages">
          {getOrderMessages(item, type).map((item, i) => (
            <ExecuteMessageItem
              key={i}
              item={item}
              click={clickContractItem}
              execute={type === 'CONTRACT'}
            />
          ))}
        </div>
      </div>
      {showResultArea && (
        <div className="contract-card-result">
          <div className="contract-card-result-header">
            <img
              src={closeIcon}
              alt="closeIcon"
              onClick={() => setShowResultArea(false)}
            />
          </div>
          <div className="contract-card-result-body">
            {result.map((item, i) => (
              <span key={i}>
                <span className="method-name">{item.name}: </span>
                <span>{item.result}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
