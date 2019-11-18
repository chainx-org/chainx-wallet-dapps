import { noneFunc } from './index'
import $t from '../locale'

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
