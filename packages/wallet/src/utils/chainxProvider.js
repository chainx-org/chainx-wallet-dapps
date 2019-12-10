import {
  addSnack,
  generateId,
  removeSnackInSeconds,
  typeEnum
} from '../reducers/snackSlice'
import { store } from '../index'
import { exFailed, exSuccess } from './constants'
import $t from '../locale'

function getMessage(err) {
  if (err.code === 'sign-transaction-busy') {
    return $t('COMMON_SIGN_TX_BUSY')
  }

  return err.msg
}

export function signAndSendExtrinsic(address, module, call, args = []) {
  return new Promise((resolve, reject) => {
    window.chainxProvider.signAndSendExtrinsic(
      address,
      module,
      call,
      args,
      ({ err, status, reject: userReject }) => {
        if (userReject) {
          console.log('transaction sign and send request is rejected.')
          reject()
          return
        }

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
        }

        if (![exSuccess, exFailed].includes(status.result)) {
          console.error(`Unkonwn extrinsic result: ${status.result}`)
          reject()
          return
        }

        resolve(status)
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
    removeSnackInSeconds(dispatch, id, 5)

    if (status.result === 'ExtrinsicSuccess') {
      resolve()
    } else {
      reject()
    }
  })
}
