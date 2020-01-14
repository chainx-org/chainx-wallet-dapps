import {
  addSnack,
  generateId,
  removeSnackInSeconds,
  typeEnum
} from '../reducers/snackSlice'
import { store } from '../index'
import { exFailed, exSuccess } from './constants'
import $t from '../locale'
import { isExtensionSelector, isSignerSelector } from '../reducers/addressSlice'
import { signer } from '../services/signer'
import { noneFunc } from './index'

function getMessage(err) {
  if (err.code === 'sign-transaction-busy') {
    return $t('COMMON_SIGN_TX_BUSY')
  }

  return err.msg
}

export function signAndSendExtrinsic(address, data) {
  const state = store.getState()
  const isExtension = isExtensionSelector(state)
  const isSigner = isSignerSelector(state)

  if (isExtension) {
    return signAndSendWithExtension(address, data)
  } else if (isSigner) {
    return signAndSendWithSigner(address, data)
  } else {
    throw new Error('Neither connected to signer nor extension')
  }
}

function handleExtrinsicResult(err, status, resolve, reject) {
  if (err) {
    let id = generateId()
    store.dispatch(
      addSnack({
        id,
        type: typeEnum.ERROR,
        title: '提交交易出错',
        message: getMessage(err)
      })
    )
    removeSnackInSeconds(store.dispatch, id, 5)
    reject()
    return
  }

  if (status.status !== 'Finalized') {
    return
  } else if (![exSuccess, exFailed].includes(status.result)) {
    console.error(`Unkonwn extrinsic result: ${status.result}`)
    reject()
    return
  }

  resolve(status)
}

export async function signAndSendWithSigner(address, hex) {
  let resolve = noneFunc,
    reject = noneFunc
  const promise = new Promise((resolve1, reject1) => {
    resolve = resolve1
    reject = reject1
  })

  const signResult = await signer.signAndSendExtrinsic(
    address,
    hex,
    (err, status) => {
      console.log('status', status)
      handleExtrinsicResult(err, status, resolve, reject)
    }
  )

  if (signResult.reject) {
    console.log('transaction sign and send request is rejected.')
    reject()
  }

  return promise
}

export function signAndSendWithExtension(address, data) {
  return new Promise((resolve, reject) => {
    window.chainxProvider.signAndSendExtrinsic(
      address,
      data,
      ({ err, status, reject: userReject }) => {
        if (userReject) {
          console.log('transaction sign and send request is rejected.')
          reject()
          return
        }

        handleExtrinsicResult(err, status, resolve, reject)
      }
    )
  })
}

export function showSnack(status, messages, dispatch) {
  const { successTitle, failTitle, successMessage, failMessage } = messages

  let type = typeEnum.SUCCESS
  let title = successTitle
  let message = successMessage

  if (status.result === 'ExtrinsicFailed') {
    type = typeEnum.ERROR
    title = failTitle
    message = failMessage
  }

  return new Promise((resolve, reject) => {
    let id = generateId()
    dispatch(addSnack({ id, type, title, message }))
    removeSnackInSeconds(dispatch, id, 8)

    if (status.result === 'ExtrinsicSuccess') {
      resolve()
    } else {
      reject()
    }
  })
}
