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
import Args from './Args'
import React from 'react'
import { useSelector } from 'react-redux'

export default function DetailedArgs({ tx }) {
  const { module, call } = tx

  switch (`${module}|${call}`) {
    case 'XAssets|transfer': {
      return <TransferArgs tx={tx} />
    }
    case 'XStaking|claim': {
      return <ClaimArgs tx={tx} />
    }
    case 'XStaking|nominate': {
      return <NominateArgs tx={tx} />
    }
    case 'XStaking|renominate': {
      return <ReNominateArgs tx={tx} />
    }
    case 'XStaking|unnominate': {
      return <UnNominateArgs tx={tx} />
    }
    case 'XStaking|unfreeze': {
      return <UnfreezeArgs tx={tx} />
    }
    case 'XAssetsProcess|withdraw': {
      return <WithdrawArgs tx={tx} />
    }
    case 'XAssetsProcess|revoke_withdraw': {
      return <RevokeWithdrawArgs tx={tx} />
    }
    default:
      return (
        <Args
          args={(tx.args || []).map(arg => {
            return { label: arg.name, value: arg.data }
          })}
        />
      )
  }
}

function TransferArgs({ tx }) {
  const chainx = getChainx()
  const address = useSelector(addressSelector)
  const { args } = tx
  const token = args.find(arg => arg.name === 'token')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')
  const dest = args.find(arg => arg.name === 'dest')
  const destAddress = chainx.account.encodeAddress(ensure0xPrefix(dest.data))

  const precision = getPrecision(token.data)

  const items = [
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

  return <Args args={items} />
}

function ClaimArgs({ tx }) {
  const { args } = tx
  const target = args.find(arg => arg.name === 'target')
  const intentions = useSelector(intentionsSelector)
  const targetIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(target.data)
  )

  const items = [
    {
      label: getLabel('target'),
      value: (targetIntention || {}).name
    }
  ]

  return <Args args={items} />
}

function NominateArgs({ tx }) {
  const { args } = tx
  const target = args.find(arg => arg.name === 'target')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')

  const intentions = useSelector(intentionsSelector)
  const targetIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(target.data)
  )

  const precision = getPrecision(tokens.PCX)

  const items = [
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

  return <Args args={items} />
}

function UnfreezeArgs(tx) {
  const { args } = tx
  const target = args.find(arg => arg.name === 'target')
  const index = args.find(arg => arg.name === 'revocation_index')

  const intentions = useSelector(intentionsSelector)
  const targetIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(target.data)
  )

  const items = [
    {
      label: getLabel('revocation_index'),
      value: index.data
    },
    {
      label: getLabel('target'),
      value: targetIntention.name
    }
  ]

  return <Args args={items} />
}

function ReNominateArgs(tx) {
  const { args } = tx
  const from = args.find(arg => arg.name === 'from')
  const to = args.find(arg => arg.name === 'to')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')

  const intentions = useSelector(intentionsSelector)
  const fromIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(from.data)
  )
  const toIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(to.data)
  )

  const precision = getPrecision(tokens.PCX)

  const items = [
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

  return <Args args={items} />
}

function UnNominateArgs(tx) {
  const { args } = tx
  const target = args.find(arg => arg.name === 'target')
  const value = args.find(arg => arg.name === 'value')
  const memo = args.find(arg => arg.name === 'memo')

  const intentions = useSelector(intentionsSelector)
  const targetIntention = intentions.find(
    intention => intention.account === ensure0xPrefix(target.data)
  )
  const precision = getPrecision(tokens.PCX)

  const items = [
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

  return <Args args={items} />
}

function WithdrawArgs(tx) {
  const { args } = tx
  const token = args.find(arg => arg.name === 'token')
  const value = args.find(arg => arg.name === 'value')
  const addr = args.find(arg => arg.name === 'addr')
  const ext = args.find(arg => arg.name === 'ext')

  const precision = getPrecision(token.data)

  const items = [
    {
      label: getLabel('token'),
      value: token.data
    },
    {
      label: getLabel('value'),
      value: `${toPrecision(value.data, precision)} ${token.data}`
    },
    {
      label: $t('TXS_Receipt_Address'),
      value: addr.data
    },
    {
      label: getLabel('memo'),
      value: ext.data
    }
  ]

  return <Args args={items} />
}

function RevokeWithdrawArgs(tx) {
  const { args } = tx
  const id = args.find(arg => arg.name === 'id')

  const items = [
    {
      label: getLabel('id'),
      value: id.data
    }
  ]

  return <Args args={items} />
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
    case 'id':
      return $t('TXS_ID')
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
