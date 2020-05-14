import { betStatusEnum } from '../../reducers/oddevenSlice'
import { getLocale } from '../../locale'

export default function({ children }) {
  const isZh = getLocale() !== 'en'
  switch (children) {
    case betStatusEnum.ON:
      return isZh ? '投注中' : 'Betting'
    case betStatusEnum.FILL:
      return isZh ? '已结束' : 'Finished'
    case betStatusEnum.TO_FILL:
      return isZh ? '等待开奖' : 'Waiting reward'
    case betStatusEnum.CLOSE:
    default:
      return '敬请期待'
  }
}
