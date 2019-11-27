import $t from '../../../../../locale'

export default function(txstate) {
  switch (txstate) {
    case 'NormalCancel':
      return $t('ASSET_WITHDRAWAL_AMOUNT_CANCEL')
    case 'Applying':
      return $t('ASSET_WITHDRAWAL_AMOUNT_APPLYING')
    case 'Confirmed':
      return $t('ASSET_WITHDRAWAL_AMOUNT_CONFIRMED')
    case 'Signing':
      return $t('ASSET_WITHDRAWAL_AMOUNT_SIGNING')
    default:
      return txstate
  }
}
