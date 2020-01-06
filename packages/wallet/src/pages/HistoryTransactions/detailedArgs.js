import $t from '../../locale'
import { store } from '../../index'
import { token as tokens } from '../../utils/constants'
import {
  lbtcPrecisionSelector,
  pcxPrecisionSelector,
  sdotPrecisionSelector,
  xbtcPrecisionSelector
} from '../selectors/assets'
import { toPrecision } from '../../utils'

export default function getDetailedArgs(tx) {
  const { module, call } = tx

  switch (`${module}|${call}`) {
    case 'XAssets|transfer': {
      return [
        {
          label: '',
          value: ''
        }
      ]
    }
    case 'XTokens|claim': {
      return ''
    }
    default:
      reeturn
  }
}

function getAssetTransfer(tx) {
  const { args } = tx
  const token = args.find(arg => arg.name === 'token')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')

  const precision = getPrecision(token.value)

  return [
    {
      label: getLabel('token'),
      value: token.data
    },
    {
      label: getLabel('value'),
      value: toPrecision(value.data, precision)
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
    throw `Invalid token: ${token}`
  }
}
