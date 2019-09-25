import camelcase from 'camelcase'

export const camelCaseKey = obj => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[camelcase(key)] = value
    return result
  }, {})
}
