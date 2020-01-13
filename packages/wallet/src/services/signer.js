import Signer from '@chainx/signer-connector'
import { addAutoCloseSnackWithParams, typeEnum } from '../reducers/snackSlice'
import $t from '../locale'
import { store } from '../index'
import { setAccount } from '../reducers/addressSlice'
import { setChainx } from './chainx'
import { mainNetApi, setApi, testNetApi } from './api'

export const signer = new Signer('dapp', true)

export async function connectSigner() {
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

  const settings = await signer.sendApiRequest({
    method: 'get_settings',
    params: []
  })

  const isTestnet = settings.network === 'chainx-testnet'
  setApi(isTestnet ? testNetApi : mainNetApi)

  const node = await signer.sendApiRequest({
    method: 'chainx_get_node',
    params: []
  })

  await setChainx(node.url)
  store.dispatch(setAccount({ ...account, isFromSigner: true }))
}

export function disconnectSigner() {
  signer.disconnect()
}
