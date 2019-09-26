import messages from './messages'
import { store } from '../index'

export default function $t(key) {
  const locale = store.getState().settings.locale
  const reversedLocale = locale === 'en' ? 'zh' : 'en'

  const value = messages[key]
  if (!value) {
    return ''
  }

  const reversedValue = value[reversedLocale]
  const message = value[locale]

  return message ? message : reversedValue ? reversedValue : ''
}
