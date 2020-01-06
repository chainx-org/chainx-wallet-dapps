import $t from '../../locale'
import { store } from '../../index'
import { token as tokens } from '../../utils/constants'
import {
  lbtcPrecisionSelector,
  pcxPrecisionSelector,
  sdotPrecisionSelector,
  xbtcPrecisionSelector
} from '../selectors/assets'
import { ensure0xPrefix, toPrecision } from '../../utils'
import { getChainx } from '../../services/chainx'
import { addressSelector } from '../../reducers/addressSlice'
import { intentionsSelector } from '../../reducers/intentionSlice'

export default function getDetailedArgs(tx) {
  const { module, call } = tx

  switch (`${module}|${call}`) {
    case 'XAssets|transfer': {
      return getAssetTransfer(tx)
    }
    case 'XStaking|claim': {
      return getClaim(tx)
    }
    case 'XStaking|nominate': {
      return getNominate(tx)
    }
    case 'XStaking|renominate': {
      return getReNominate(tx)
    }
    case 'XStaking|unnominate': {
      return getUnNominate(tx)
    }
    case 'XStaking|unfreeze': {
      return getUnfreeze(tx)
    }
    default:
      return []
  }
}

function getAssetTransfer(tx) {
  const chainx = getChainx()
  const state = store.getState()
  const address = addressSelector(state)
  const { args } = tx
  const token = args.find(arg => arg.name === 'token')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')
  const dest = args.find(arg => arg.name === 'dest')
  const destAddress = chainx.account.encodeAddress(ensure0xPrefix(dest.data))

  const precision = getPrecision(token.data)

  return [
    {
      label: getLabel('token'),
      value: token.data
    },
    {
      label: getLabel('value'),
      value: `${toPrecision(value.data, precision)} ${token.data}`
    },
    {
      label: getLabel('memo'),
      value: memo.data
    },
    {
      label: getLabel(address === destAddress ? 'source' : 'target'),
      value: destAddress
    }
  ]
}

function getClaim(tx) {
  const { args } = tx
  const target = args.find(arg => arg.name === 'target')

  const state = store.getState()
  const intentions = intentionsSelector(state)
  const targetIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(target.data)
  )

  return [
    {
      label: getLabel('target'),
      value: targetIntention.name
    }
  ]
}

function getNominate(tx) {
  const { args } = tx
  const target = args.find(arg => arg.name === 'target')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')

  const state = store.getState()
  const intentions = intentionsSelector(state)
  const targetIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(target.data)
  )

  const precision = getPrecision(tokens.PCX)

  return [
    {
      label: getLabel('value'),
      value: `${toPrecision(value.data, precision)} ${tokens.PCX} `
    },
    {
      label: getLabel('memo'),
      value: memo.data
    },
    {
      label: getLabel('target'),
      value: targetIntention.name
    }
  ]
}

function getIntention(accountId) {
  const state = store.getState()
  const intentions = intentionsSelector(state)
  return intentions.find(
    intention => intention.account === ensure0xPrefix(accountId)
  )
}

function getUnfreeze(tx) {
  const { args } = tx
  const target = args.find(arg => arg.name === 'target')
  const index = args.find(arg => arg.name === 'revocation_index')

  const targetIntention = getIntention(target.data)
  return [
    {
      label: getLabel('revocation_index'),
      value: index.data
    },
    {
      label: getLabel('target'),
      value: targetIntention.name
    }
  ]
}

function getReNominate(tx) {
  const { args } = tx
  const from = args.find(arg => arg.name === 'from')
  const to = args.find(arg => arg.name === 'to')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')

  const state = store.getState()
  const intentions = intentionsSelector(state)
  const fromIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(from.data)
  )
  const toIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(to.data)
  )

  const precision = getPrecision(tokens.PCX)

  return [
    {
      label: getLabel('from'),
      value: fromIntention.name
    },
    {
      label: getLabel('to'),
      value: toIntention.name
    },
    {
      label: getLabel('value'),
      value: `${toPrecision(value.data, precision)} ${tokens.PCX}`
    },
    {
      label: getLabel('memo'),
      value: memo.data
    }
  ]
}

function getUnNominate(tx) {
  const { args } = tx
  const target = args.find(arg => arg.name === 'target')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')

  const intentions = intentionsSelector(store.getState())
  const targetIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(target.data)
  )
  const precision = getPrecision(tokens.PCX)

  return [
    {
      label: getLabel('target'),
      value: targetIntention.name
    },
    {
      label: getLabel('value'),
      value: `${toPrecision(value.data, precision)} ${tokens.PCX} `
    },
    {
      label: getLabel('memo'),
      value: memo.data
    }
  ]
}

function getLabel(name) {
  switch (name) {
    case 'token':
      return $t('TXS_TOKEN')
    case 'value':
      return $t('TXS_AMOUNT')
    case 'memo':
      return $t('TXS_MEMO')
    case 'source':
      return $t('TXS_SOURCE_ACCOUNT')
    case 'target':
    case 'to':
      return $t('TXS_TARGET_ACCOUNT')
    case 'from':
      return $t('TXS_SOURCE_NODE')
    case 'revocation_index':
      return $t('TXS_REVOCATION_INDEX')
    default:
      return ''
  }
}

function getPrecision(token) {
  const state = store.getState()

  if (token === tokens.PCX) {
    return pcxPrecisionSelector(state)
  } else if (token === tokens.LBTC) {
    return lbtcPrecisionSelector(state)
  } else if (token === tokens.XBTC) {
    return xbtcPrecisionSelector(state)
  } else if (token === tokens.SDOT) {
    return sdotPrecisionSelector(state)
  } else {
    throw new Error(`Invalid token: ${token}`)
  }
}
