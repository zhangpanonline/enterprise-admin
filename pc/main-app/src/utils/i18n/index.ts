import { createI18n } from 'vue-i18n'
import messages from './langs'

const i18n = createI18n<[typeof messages.zh], 'zh' | 'en'>({
  legacy: false,
  locale: localStorage.getItem('i18n.language') || 'zh',
  fallbackLocale: 'en',
  messages,
})

export default i18n