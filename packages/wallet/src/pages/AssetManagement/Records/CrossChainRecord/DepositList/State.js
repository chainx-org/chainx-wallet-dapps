import $t from '../../../../../locale'

export default function getState(state) {
  if (state === 'Confirmed') {
    return $t('ASSET_DEPOSIT_CONFIRMED')
  }

  return state
}
