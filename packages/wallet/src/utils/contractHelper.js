import { getChainx } from '../services/chainx'
import { compactAddLength, stringCamelCase, u8aToU8a } from '@chainx/util'
import { blake2AsU8a } from '@chainx/util-crypto'
import { createType } from '@chainx/types'
import { Abi } from '@chainx/api-contract'

// const Alice = chainx.account.from('Alice')
// const Alice = chainx.account.from('0x436861696e582d416c6963652020202020202020202020202020202020202020')
// new test node alice account
// const Alice = chainx.account.from('0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115')
// Alice:   0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115
// Bob:     0x3b7b60af2abcd57ba401ab398f84f4ca54bd6b2140d2503fbcf3286535fe3ff1
// Charlie: 0x072c02fa1409dc37e03a4ed01703d4a9e6bba9c228a49a00366e9630a97cba7c
// Dave:    0x771f47d3caf8a2ee40b0719e1c1ecbc01d73ada220cf08df12a00453ab703738

let chainx
// window.chainxProvider && window.chainxProvider.getCurrentNode().then(async node => {
//   chainx = await setChainx(node.url)
// })

const Alice =
  chainx &&
  chainx.account.from(
    '0x436861696e582d5361746f736869202020202020202020202020202020202020'
  )
const enableExtension = true

export async function call(abi, address, method, gas, params) {
  const account = await window.chainxProvider.enable()
  const chainx = getChainx()
  const parseAbi = new Abi(abi)
  debugger
  parseParams(parseAbi.messages[stringCamelCase(method)].args, params)
  try {
    const obj = {
      origin: account.address,
      dest: address,
      gasLimit: gas,
      inputData: parseAbi.messages[stringCamelCase(method)](...params)
    }

    const result = await chainx.api.rpc.chainx.contractCall(obj)
    console.log('call result: ', result)
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
      }
      const data = createType(
        returnType.replace('{ "elems": "Vec" }<u8>', 'Text'),
        u8aToU8a(result.data)
      ).toJSON()
      if (data) {
        return { status: true, result: data.toString() }
      } else {
        return { status: true, result: result }
      }
    } else {
      return { status: false, result: 'status is error' }
    }
  } catch (error) {
    console.log(error)
    return { status: false, result: error.message }
  }
}

export async function send(abi, address, method, params, value, gas, cb) {
  const chainx = getChainx()
  const parseAbi = new Abi(abi)
  const _method = 'call'
  parseParams(parseAbi.messages[stringCamelCase(method)].args, params)
  try {
    const args = [
      address,
      value || 0,
      gas,
      parseAbi.messages[stringCamelCase(method)](...params)
    ]
    const ex = chainx.api.tx.xContracts[_method](...args)
    if (enableExtension) {
      contractApi(ex.toHex(), cb)
      return { status: true }
    }

    ex.signAndSend(Alice, cb)
    return { status: true }
  } catch (error) {
    return { status: false, result: error.message }
  }
}

export async function isCodeHashExist(codeHash) {
  const chainx = getChainx()
  const result = await chainx.api.query.xContracts.pristineCode(codeHash)
  if (result.length > 0) {
    return true
  } else {
    return false
  }
}

export async function isContractExist(address) {
  const chainx = getChainx()
  try {
    const result = await chainx.api.query.xContracts.contractInfoOf(address)
    if (result.isEmpty) {
      return false
    } else {
      return true
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function uploadContract(file, gas, cb) {
  const chainx = getChainx()
  const method = 'putCode'
  let codehash = '0x'
  blake2AsU8a(file.data).forEach(i => {
    codehash += ('0' + i.toString(16)).slice(-2)
  })
  const isExist = await isCodeHashExist(codehash)
  if (isExist) {
    cb({
      err: {
        message:
          'codehash exist, please add existing codehash, using: ' + codehash
      },
      status: ''
    })
    return
  }
  const args = [gas, compactAddLength(file.data)]
  const ex = chainx.api.tx.xContracts[method](...args)
  if (enableExtension) {
    contractApi(ex.toHex(), cb)
    return
  }
  ex.signAndSend(Alice, convertCb(cb))
}

export async function deploy(_abi, params, endowment, gas, cb) {
  const chainx = getChainx()
  const abi = new Abi(_abi.abi)
  const method = 'instantiate'
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
  const ex = chainx.api.tx.xContracts[method](...args)
  if (enableExtension) {
    contractApi(ex.toHex(), cb)
    return
  }
  ex.signAndSend(Alice, convertCb(cb))
}

const contractApi = async (hex, cb) => {
  const account = await window.chainxProvider.enable()
  window.chainxProvider.signAndSendExtrinsic(account.address, hex, cb)
}

const parseParams = (args, params) => {
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

const convertCb = cb => {
  return (err, result) => {
    cb({ err: err, status: result })
  }
}
