export default function({ args = [] }) {
  return args.reduce((result, item, index) => {
    return result + `${index <= 0 ? '' : ','}${item.label}: ${item.value}`
  }, '')
}
