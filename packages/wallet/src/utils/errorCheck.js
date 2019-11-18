import { noneFunc } from './index'
import $t from '../locale'
import BigNumber from 'bignumber.js'

export function checkMemoAndHasError(
  memo,
  setMemoErrMsg = noneFunc,
  hookFunc = noneFunc
) {
  if ((memo || '').length > 64) {
    setMemoErrMsg($t('COMMON_TOO_LONG'))
    hookFunc()
    return true
  }

  return false
}

export function checkAmountAndHasError(
  amount,
  precision,
  free,
  setAmountErrMsg,
  hookFunc = noneFunc
) {
  if (isNaN(parseFloat(amount))) {
    setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_ERROR'))
    hookFunc()
    return true
  }

  const realAmount = BigNumber(amount)
    .multipliedBy(Math.pow(10, precision))
    .toNumber()

  if (realAmount > free) {
    setAmountErrMsg($t('ASSET_TRANSFER_AMOUNT_TOO_MUCH_ERROR'))
    hookFunc()
    return true
  }

  return false
}
