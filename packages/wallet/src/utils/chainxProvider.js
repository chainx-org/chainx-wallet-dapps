import {
  addSnack,
  generateId,
  removeSnackInSeconds,
  typeEnum
} from '../reducers/snackSlice'
import { store } from '../index'
import { exFailed, exSuccess } from './constants'
import { noneFunc } from './index'

function signAndSendExtrinsic(
  address,
  module,
  call,
  args = [],
  titleFunc = noneFunc,
  messageFunc = noneFunc
) {
  window.chainxProvider.signAndSendExtrinsic(
    address,
    module,
    call,
    args,
    ({ err, status, reject }) => {
      if (reject) {
        console.log('transaction sign and send request is rejected.')
        return
      }

      let id = generateId()
      if (err) {
        store.dispatch(
          addSnack({
            id,
            type: typeEnum.ERROR,
            title: '错误',
            message: '提交交易出错'
          })
        )
        removeSnackInSeconds(store.dispatch, id, 5)
        return
      }

      if (status.status !== 'Finalized') {
        return
      }

      if (![exSuccess, exFailed].includes(status.result)) {
        console.error(`Unkonwn extrinsic result: ${status.result}`)
        return
      }

      let type = typeEnum.SUCCESS
      let title = titleFunc(err, status)
      let message = messageFunc(err, status)

      if (status.result === 'ExtrinsicFailed') {
        type = typeEnum.ERROR
      }
      store.dispatch(addSnack({ id, type, title, message }))
      removeSnackInSeconds(dispatch, id, 5)
    }
  )
}
