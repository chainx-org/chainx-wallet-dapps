import Signer from '@chainx/signer-connector'
import { addAutoCloseSnackWithParams, typeEnum } from '../reducers/snackSlice'
import $t from '../locale'
import { store } from '../index'

const signer = new Signer('dapp')

export async function connectSigner() {
  try {
    const linked = await signer.link()
    console.log(linked ? `connect successfully` : `failed to connect`)

    const account = await signer.sendApiRequest({
      method: 'chainx_account',
      params: []
    })

    if (!account) {
      return addAutoCloseSnackWithParams(
        store.dispatch,
        typeEnum.ERROR,
        $t('HEADER_MSG_NO_SIGNER_ACCOUNT_TITLE'),
        $t('HEADER_MSG_NO_SIGNER_ACCOUNT_DETAIL')
      )
    }

    console.log('account', account)

    signer.disconnect()
  } catch (e) {
    addAutoCloseSnackWithParams(
      store.dispatch,
      typeEnum.ERROR,
      $t('HEADER_MSG_SIGNER_LINK_FAIL_TITLE'),
      $t('HEADER_MSG_SIGNER_LINK_FAIL_DETAIL')
    )
  }
}
