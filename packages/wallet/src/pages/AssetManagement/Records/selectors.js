import { createSelector } from 'redux-starter-kit'
import { scrollTransfersSelector } from '../../../reducers/transactionSlice'
import moment from 'moment'
import { addressSelector } from '../../../reducers/addressSlice'
import { getChainx } from '../../../services/chainx'
import { ensure0xPrefix, toPrecision } from '../../../utils'
import $t from '../../../locale'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { sdotPrecisionSelector } from '../../selectors/assets'
import {
  xbtcPrecisionSelector,
  lbtcPrecisionSelector
} from '../../selectors/assets'

export const normalizedScrollTransfers = createSelector(
  scrollTransfersSelector,
  addressSelector,
  pcxPrecisionSelector,
  sdotPrecisionSelector,
  xbtcPrecisionSelector,
  lbtcPrecisionSelector,
  (
    scrollTransfers,
    address,
    pcxPrecision,
    sdotPrecision,
    xbtcPrecision,
    lbtcPrecision
  ) => {
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
        value = toPrecision(item.number, xbtcPrecision)
      } else if (item.token === 'SDOT') {
        value = toPrecision(item.number, sdotPrecision)
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
