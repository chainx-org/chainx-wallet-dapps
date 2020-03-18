import Signer from '@chainx/signer-connector'
import {
  addAutoCloseSnackWithParams,
  addSnack,
  generateId,
  typeEnum
} from '../reducers/snackSlice'
import $t from '../locale'
import { store } from '../index'
import { setAccount } from '../reducers/addressSlice'
import { setChainx } from './chainx'
import { mainNetApi, setApi, testNetApi } from './api'
import { networkChangeListener, nodeChangeListener } from '../connector'
import _ from 'lodash'
import { nonFunc } from '@chainx/signer-connector/dist/constants'
import { setNetwork } from '../reducers/settingsSlice'
import { sleep } from '../utils'

export const signer = new Signer('dapp')

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

  signer.addSocketCloseHandler(() => {
    let id = generateId()
    const type = typeEnum.ERROR
    const title = $t('HEADER_SIGNER_DISCONNECT_TITLE')
    const message = $t('HEADER_SIGNER_DISCONNECT_DETAIL')
    store.dispatch(addSnack({ id, type, title, message }))
  })
}

export async function connectSigner() {
  const linked = await Promise.race([signer.link(), sleep(20)])

  console.log(linked ? `connect successfully` : `failed to connect`)

  const account = await signer.getCurrentAccount()

  if (_.isEmpty(account)) {
    addAutoCloseSnackWithParams(
      store.dispatch,
      typeEnum.ERROR,
      $t('HEADER_MSG_NO_SIGNER_ACCOUNT_TITLE'),
      $t('HEADER_MSG_NO_SIGNER_ACCOUNT_DETAIL')
    )

    throw new Error('No account in signer')
  }

  const node = await signer.getCurrentNode()
  if (
    node &&
    window.location.protocol === 'https' &&
    (node.url || '').startsWith('ws://')
  ) {
    addAutoCloseSnackWithParams(
      store.dispatch,
      typeEnum.ERROR,
      $t('HEADER_MSG_NODE_INVALID_TITLE'),
      $t('HEADER_MSG_NODE_INVALID_DETAIL')
    )

    throw new Error('Invalid node protocol')
  }
  await setChainx(node.url)

  const settings = await signer.getSettings()
  const isTestnet = settings.network === 'chainx-testnet'
  store.dispatch(setNetwork(isTestnet ? 'testnet' : 'mainnet'))
  setApi(isTestnet ? testNetApi : mainNetApi)

  store.dispatch(setAccount({ ...account, isFromSigner: true }))

  listenSigner()
}

export function disconnectSigner() {
  signer.removeAccountChangeListener(accountChangeListener)
  signer.removeNodeChangeListener(nodeChangeListener)
  signer.removeNetworkChangeListener(networkChangeListener)
  signer.addSocketCloseHandler(nonFunc)

  signer.disconnect()
}
