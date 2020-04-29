import { betStatusEnum } from '../../reducers/oddevenSlice'

export default function({ children }) {
  switch (children) {
    case betStatusEnum.ON:
      return '投注中'
    case betStatusEnum.FILL:
      return '已结束'
    case betStatusEnum.TO_FILL:
      return '等待开奖'
    case betStatusEnum.CLOSE:
    default:
      return '敬请期待'
  }
}
