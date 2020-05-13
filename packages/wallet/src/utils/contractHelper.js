import { getChainx } from '../services/chainx'
import { stringCamelCase, u8aToU8a } from '@chainx/util'
import { createType } from '@chainx/types'
import { Abi } from '@chainx/api-contract'
import { littleEndianToBigEndian } from './index'
import { store } from '../index'
import { addressSelector } from '../reducers/addressSlice'
import { showSnack, signAndSendExtrinsic } from './chainxProvider'

// const Alice = chainx.account.from('Alice')
// const Alice = chainx.account.from('0x436861696e582d416c6963652020202020202020202020202020202020202020')
// new test node alice account
// const Alice = chainx.account.from('0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115')
// Alice:   0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115
// Bob:     0x3b7b60af2abcd57ba401ab398f84f4ca54bd6b2140d2503fbcf3286535fe3ff1
// Charlie: 0x072c02fa1409dc37e03a4ed01703d4a9e6bba9c228a49a00366e9630a97cba7c
// Dave:    0x771f47d3caf8a2ee40b0719e1c1ecbc01d73ada220cf08df12a00453ab703738

export async function call(abi, address, method, gas, params) {
  const accountAddress = addressSelector(store.getState())
  const chainx = getChainx()
  const parseAbi = new Abi(abi)
  parseParams(parseAbi.messages[stringCamelCase(method)].args, params)
  try {
    const obj = {
      origin: accountAddress,
      dest: address,
      gasLimit: gas,
      inputData: parseAbi.messages[stringCamelCase(method)](...params)
    }
    const result = await chainx.api.rpc.chainx.contractCall(obj)
    if (result.status === 0) {
      const typeObj = parseAbi.messages[stringCamelCase(method)].type
      let returnType = typeObj.displayName
      // const sliceData = '0x' + result.data.slice(4)
      // const data = createType(returnType, u8aToU8a(sliceData)).toJSON()
      if (returnType === 'Option') {
        returnType = typeObj.type
      } else if (returnType === 'Vec') {
        const vecContent = typeObj.params[0].type
        returnType = `Vec<${vecContent}>`
      } else if (returnType === 'BTreeMap') {
        returnType = typeObj.type
      } else if (returnType === 'H256Wrapper') {
        returnType = 'H256'
      } else {
        returnType = typeObj.type
      }
      let data = createType(
        returnType.replace('{ "elems": "Vec" }<u8>', 'Text'),
        u8aToU8a(result.data)
      ).toJSON()
      //h256 should take special methods, because  contract rcp return littleEndian, so we should revert it to big
      if (returnType === 'H256') {
        data = littleEndianToBigEndian(data)
      }
      return { status: true, result: JSON.stringify(data) }
    } else {
      return { status: false, result: 'status is error' }
    }
  } catch (error) {
    console.log(error)
    return { status: false, result: error.message }
  }
}

export async function send(abi, address, method, params, value, gas) {
  const chainx = getChainx()
  const parseAbi = new Abi(abi)
  parseParams(parseAbi.messages[stringCamelCase(method)].args, params)
  try {
    const args = [
      address,
      value || 0,
      gas,
      parseAbi.messages[stringCamelCase(method)](...params)
    ]
    const ex = chainx.api.tx.xContracts.call(...args)

    const status = await signAndSend(ex.toHex())
    const prefix = '调用'
    const messages = {
      successTitle: `${prefix}成功`,
      failTitle: `${prefix}失败`,
      successMessage: `${method} 调用成功`,
      failMessage: `交易hash ${status.txHash}`
    }

    await showSnack(status, messages, store.dispatch)
  } catch (error) {
    return { status: false, result: error && error.message }
  }
}

export async function isCodeHashExist(codeHash) {
  const chainx = getChainx()
  const result = await chainx.api.query.xContracts.pristineCode(codeHash)
  return result.length > 0
}

export async function isContractExist(address) {
  const chainx = getChainx()
  try {
    const result = await chainx.api.query.xContracts.contractInfoOf(address)
    return !result.isEmpty
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function deploy(_abi, params, endowment, gas) {
  const chainx = getChainx()
  const abi = new Abi(_abi.abi)
  if (abi.constructors[0].args.length !== params.length) {
    console.log('params length is not correct', params)
    return
  }
  parseParams(abi.constructors[0].args, params)
  const selector = JSON.parse(_abi.abi.contract.constructors[0].selector)
  const args = [
    endowment,
    gas,
    _abi.codeHash,
    selector.reduce((a, b) => a + b.slice(2)) +
      abi.constructors[0](...params).slice(2)
  ]
  console.log('deploy abi in utils ', abi, args, params)
  const ex = chainx.api.tx.xContracts['instantiate'](...args)
  const accountAddress = addressSelector(store.getState())
  return signAndSendExtrinsic(accountAddress, ex.toHex())
}

async function signAndSend(hex) {
  const accountAddress = addressSelector(store.getState())
  return signAndSendExtrinsic(accountAddress, hex)
}

export const parseParams = (args, params) => {
  args.forEach((arg, i) => {
    const t = arg.type.type
    if (t.startsWith('u')) {
      params[i] = parseInt(params[i])
    } else if (t === 'bool' && typeof params[i] === 'string') {
      params[i] = JSON.parse(params[i].toLowerCase())
    }
  })
  return params
}
