import { store } from '../index'
import { setNode } from '../reducers/nodeSlice'
import { setAccount } from '../reducers/addressSlice'
import { setNetwork } from '../reducers/settingsSlice'
import { setChainx } from '../services/chainx'
import { mainNetApi, setApi, testNetApi } from '../services/api'
import { addAutoCloseSnackWithParams, typeEnum } from '../reducers/snackSlice'
import $t from '../locale'

export const nodeChangeListener = ({ to }) => {
  const { url } = store.getState().node
  if (url !== to.url) {
    store.dispatch(setNode(to))
    setTimeout(() => {
      window.location.reload()
    }, 0)
  }
}

const accountChangeListener = ({ to }) => {
  console.log('update extension accounts', [to])
  if (to) {
    store.dispatch(
      setAccount({
        name: to.name,
        address: to.address,
        isFromExtension: true
      })
    )
  }

  window.location.reload()
}

export const networkChangeListener = ({ to }) => {
  store.dispatch(setNetwork(to))
  window.location.reload()
}

async function setExtensionNode() {
  const node = await window.chainxProvider.getCurrentNode()
  store.dispatch(setNode(node))
  await setChainx(node.url)
}

async function setExtensionAccount() {
  const extensionAccount = await window.chainxProvider.enable()

  store.dispatch(
    setAccount({
      name: extensionAccount.name,
      address: extensionAccount.address,
      isFromExtension: true
    })
  )
}

export async function connectExtension() {
  const extensionAccount = await window.chainxProvider.enable()
  if (!extensionAccount) {
    addAutoCloseSnackWithParams(
      store.dispatch,
      typeEnum.ERROR,
      $t('HEADER_MSG_NO_EXTENSION_ACCOUNT_TITLE'),
      $t('HEADER_MSG_NO_EXTENSION_ACCOUNT_DETAIL')
    )

    throw new Error('No account in extension')
  }

  const network = await window.chainxProvider.getNetwork()
  store.dispatch(setNetwork(network))
  setApi(network === 'testnet' ? testNetApi : mainNetApi)

  await setExtensionAccount(network)
  await setExtensionNode()
  listenExtension()
}

export function listenExtension() {
  window.chainxProvider.listenNetworkChange(networkChangeListener)
  window.chainxProvider.listenAccountChange(accountChangeListener)
  window.chainxProvider.listenNodeChange(nodeChangeListener)
}

export function disConnectExtension() {
  if (window.chainxProvider.removeNodeChangeListener) {
    window.chainxProvider.removeNodeChangeListener(nodeChangeListener)
    window.chainxProvider.removeAccountChangeListener(accountChangeListener)
    window.chainxProvider.removeNetworkChangeListener(networkChangeListener)
  }
}
