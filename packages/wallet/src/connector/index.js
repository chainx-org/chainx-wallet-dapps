import { store } from '../index'
import { setNode } from '../reducers/nodeSlice'
import { setAccount, setExtensionAccounts } from '../reducers/addressSlice'
import { setNetwork } from '../reducers/settingsSlice'
import { setChainx } from '../services/chainx'
import { mainNetApi, setApi, testNetApi } from '../services/api'

const extensionNodeChangeListener = ({ to }) => {
  const { url } = store.getState().node
  if (url !== to.url) {
    store.dispatch(setNode(to))
    setTimeout(() => {
      window.location.reload()
    }, 0)
  }
}

const extensionAccountChangeListener = ({ to }) => {
  console.log('update extension accounts', [to])
  if (to) {
    store.dispatch(setExtensionAccounts([to]))
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

const extensionNetworkChangeListener = ({ to }) => {
  store.dispatch(setNetwork(to))
  window.location.reload()
}

async function setExtensionNode(nowUrl) {
  const node = await window.chainxProvider.getCurrentNode()
  if (nowUrl !== node.url) {
    store.dispatch(setNode(node))
    await setChainx(node.url)
  } else {
    await setChainx(nowUrl)
  }
}

async function setExtensionAccount(network) {
  const account = await window.chainxProvider.enable()
  store.dispatch(setExtensionAccounts(account ? [{ ...account, network }] : []))
}

export async function connectExtension() {
  const network = await window.chainxProvider.getNetwork()
  store.dispatch(setNetwork(network))
  setApi(network === 'testnet' ? testNetApi : mainNetApi)

  await setExtensionAccount(network)
  await setExtensionNode()

  window.chainxProvider.listenNetworkChange(extensionNetworkChangeListener)
  window.chainxProvider.listenAccountChange(extensionAccountChangeListener)
  window.chainxProvider.listenNodeChange(extensionNodeChangeListener)
}
