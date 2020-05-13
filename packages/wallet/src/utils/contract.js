import { u8aToU8a } from '@chainx/util'
import { littleEndianToBigEndian } from './index'
import { createType } from '@chainx/types'

export function parseValue(typeObj, origin) {
  let returnType = typeObj.displayName
  if (returnType === 'Option') {
    returnType = typeObj.type
  } else if (returnType === 'Vec') {
    const vecContent = typeObj.params[0].type
    returnType = `Vec<${vecContent}>`
  } else if (returnType === 'BTreeMap') {
    returnType = typeObj.type
  } else if (returnType === 'H256Wrapper') {
    returnType = 'H256'
  }

  let data = createType(
    returnType.replace('{ "elems": "Vec" }<u8>', 'Text'),
    u8aToU8a(origin)
  ).toJSON()
  //h256 should take special methods, because  contract rcp return littleEndian, so we should revert it to big
  if (returnType === 'H256') {
    data = littleEndianToBigEndian(data)
  }

  return data
}
