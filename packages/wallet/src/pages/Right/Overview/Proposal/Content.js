import React from 'react'
import { useSelector } from 'react-redux'
import { proposalsSelector } from '../../../../reducers/rightSlice'
import { TableBody, TableRow } from '@chainx/ui'
import { BaseCell } from '../../../Trade/Orders/UserOrders/Wrapper'
import { FlexCell } from './Wrapper'
import $t from '../../../../locale'
import { Amount } from '@components'
import { hexToBytes, remove0xPrefix } from '../../../../utils'
import { Button } from '../../../Council/Overview/index'
import addIcon from '../../../../components/addIcon'

export default function() {
  const list = useSelector(proposalsSelector)
  console.log(list)
  return (
    <TableBody>
      {list.map((val, index) => {
        return (
          <TableRow key={index}>
            <FlexCell>
              <span>{String(val.index)}</span>
              <span>{val.proposer}</span>
            </FlexCell>
            <BaseCell style={{ width: '25%' }}>
              <span>{hexToBytes(remove0xPrefix(val.imageHash))}</span>
            </BaseCell>
            <FlexCell>
              <span>
                <Amount value={val.balance} precision={8} />
                PCX
              </span>
              <Button>
                {addIcon()}
                {$t('RIGHT_IMAGE')}
              </Button>
            </FlexCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}
