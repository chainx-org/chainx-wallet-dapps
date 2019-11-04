import {
  addSnack,
  generateId,
  removeSnackInSeconds,
  typeEnum
} from '../reducers/snackSlice'
import { store } from '../index'
import { exFailed, exSuccess } from './constants'

export function signAndSendExtrinsic(address, module, call, args = []) {
  return new Promise((resolve, reject) => {
    window.chainxProvider.signAndSendExtrinsic(
      address,
      module,
      call,
      args,
      ({ err, status, reject: useReject }) => {
        if (useReject) {
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
              title: '错误',
              message: '提交交易出错'
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
