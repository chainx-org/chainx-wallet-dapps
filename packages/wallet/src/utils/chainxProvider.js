import {
  addAutoCloseSnackWithParams,
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

function getMessage(err) {
  if (err.code === 'sign-transaction-busy') {
    return $t('COMMON_SIGN_TX_BUSY')
  }

  return err.msg || err.message
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
    console.error('hash error')
    throw new Error('Neither connected to signer nor extension')
  }
}

function handleExtrinsicResult(err, status, resolve, reject) {
  if (err) {
    notifyError(err, reject)
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

function notifyError(err, reject) {
  addAutoCloseSnackWithParams(
    store.dispatch,
    typeEnum.ERROR,
    $t('COMMON_TX_ERROR_TITLE'),
    getMessage(err),
    8
  )

  reject()
}

function handleSignerExtrinsicResult(
  err,
  { normalizedEvents, events = [], status },
  resolve,
  reject
) {
  if (err) {
    notifyError(err, reject)
    return
  }

  const result = { events, status, normalizedEvents }
  console.log('result', result)

  if (!status?.InBlock) {
    return
  }

  console.log('resolve', result)
  resolve(result)
}

export async function signAndSendWithSigner(address, data) {
  return new Promise(async (resolve, reject) => {
    const signResult = await signer
      .signAndSendChainx2Extrinsic(address, data, (err, status) => {
        console.log('err: ', err, 'status:', status)
        handleSignerExtrinsicResult(err, status, resolve, reject)
      })
      .catch(e => {
        const errorCodes = ['sign-transaction-busy', 'invalid-sign-data']

        if (e && errorCodes.includes(e.code)) {
          addAutoCloseSnackWithParams(
            store.dispatch,
            typeEnum.ERROR,
            $t(
              e.code === errorCodes[1]
                ? 'sign_invalid_tx'
                : 'COMMON_TX_ERROR_TITLE'
            ),
            getMessage(e),
            8
          )
        }
        reject()
      })

    if (signResult && signResult.reject) {
      console.log('transaction sign and send request is rejected.')
      reject()
    }
  })
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

export function showSnack(
  { normalizedEvents: events = [], status },
  messages,
  dispatch
) {
  const { successTitle, failTitle, successMessage, failMessage } = messages

  let type = typeEnum.SUCCESS
  let title = successTitle
  let message = successMessage

  const success = events.some(({ method, section }) => {
    return section === 'system' && method === 'ExtrinsicSuccess'
  })

  if (!success) {
    type = typeEnum.ERROR
    title = failTitle
    message = failMessage
  }

  return new Promise((resolve, reject) => {
    let id = generateId()
    dispatch(addSnack({ id, type, title, message }))
    removeSnackInSeconds(dispatch, id, 8)

    if (success) {
      resolve()
    } else {
      reject()
    }
  })
}

export function isExtrinsicSuccess(status) {
  const { normalizedEvents: events = [] } = status

  return events.some(({ method, section }) => {
    return section === 'system' && method === 'ExtrinsicSuccess'
  })
}
