import Signer from '@chainx/signer-connector'
import { addAutoCloseSnackWithParams, typeEnum } from '../reducers/snackSlice'
import $t from '../locale'
import { store } from '../index'
import { setAccount } from '../reducers/addressSlice'
import { setChainx } from './chainx'
import { mainNetApi, setApi, testNetApi } from './api'
import { networkChangeListener, nodeChangeListener } from '../connector'

export const signer = new Signer('dapp', true)

export const accountChangeListener = ({ to }) => {
  console.log('update extension accounts', [to])
  if (to) {
    store.dispatch(
      setAccount({
        name: to.name,
        address: to.address,
        isFromSigner: true
      })
    )
  }

  window.location.reload()
}

export function listenSigner() {
  signer.listenAccountChange(accountChangeListener)
  signer.listenNodeChange(nodeChangeListener)
  signer.listenNetworkChange(networkChangeListener)
}

export async function connectSigner() {
  const linked = await signer.link()
  console.log(linked ? `connect successfully` : `failed to connect`)

  const account = await signer.getCurrentAccount()

  if (!account) {
    return addAutoCloseSnackWithParams(
      store.dispatch,
      typeEnum.ERROR,
      $t('HEADER_MSG_NO_SIGNER_ACCOUNT_TITLE'),
      $t('HEADER_MSG_NO_SIGNER_ACCOUNT_DETAIL')
    )
  }

  const settings = await signer.getSettings()

  const isTestnet = settings.network === 'chainx-testnet'
  setApi(isTestnet ? testNetApi : mainNetApi)

  const node = await signer.getCurrentNode()

  await setChainx(node.url)
  store.dispatch(setAccount({ ...account, isFromSigner: true }))

  listenSigner()
}

export function disconnectSigner() {
  signer.removeAccountChangeListener(accountChangeListener)
  signer.removeNodeChangeListener(nodeChangeListener)
  signer.removeNetworkChangeListener(networkChangeListener)

  signer.disconnect()
}
