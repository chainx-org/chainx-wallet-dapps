import { createSelector } from '@reduxjs/toolkit'
import { scrollTransfersSelector } from '../../../reducers/transactionSlice'
import moment from 'moment'
import { addressSelector } from '../../../reducers/addressSlice'
import { getChainx } from '../../../services/chainx'
import { ensure0xPrefix, toPrecision } from '../../../utils'
import $t from '../../../locale'
import {
  pcxPrecisionSelector,
  sdotPrecisionSelector,
  xbtcPrecisionSelector
} from '../../selectors/assets'

export const normalizedScrollTransfers = createSelector(
  scrollTransfersSelector,
  addressSelector,
  pcxPrecisionSelector,
  sdotPrecisionSelector,
  xbtcPrecisionSelector,
  (scrollTransfers, address, pcxPrecision, sdotPrecision, xbtcPrecision) => {
    const chainx = getChainx()
    return scrollTransfers.items.map(item => {
      const accountId = chainx.account.decodeAddress(address, false)
      let direction = $t('ASSET_TRANSFER_OUT')
      if (accountId === ensure0xPrefix(item.payee || '')) {
        direction = $t('ASSET_TRANSFER_IN')
      }

      let value
      if (item.token === 'PCX') {
        value = toPrecision(item.value, pcxPrecision)
      } else if (item.token === 'BTC') {
        value = toPrecision(item.value, xbtcPrecision)
      } else if (item.token === 'SDOT') {
        value = toPrecision(item.value, sdotPrecision)
      }

      return {
        ...item,
        time: moment(item.time).format('YYYY/MM/DD HH:mm'),
        direction,
        value
      }
    })
  }
)
