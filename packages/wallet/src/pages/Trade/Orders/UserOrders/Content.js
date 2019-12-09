import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  currentPairIdSelector,
  fetchNowOrders,
  fetchQuotations,
  userOrders
} from '../../../../reducers/tradeSlice'
import { Table, TableBody, TableRow } from '@chainx/ui'
import moment from 'moment'
import {
  pairAssetPrecision,
  pairCurrencyPrecision
} from '../../Module/selectors'
import { toPrecision } from '../../../../utils'
import {
  ActionCell,
  FillCell,
  IndexCell,
  NumberCell,
  PairCell,
  TimeCell
} from './Wrapper'
import cancelIcon from '../svg/cancel.svg'
import cancelDisabledIcon from '../svg/cancel-disabled.svg'
import { getChainx } from '../../../../services/chainx'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../utils/chainxProvider'
import { addressSelector } from '../../../../reducers/addressSlice'

export default function() {
  const accountAddress = useSelector(addressSelector)
  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(accountAddress, false)

  const orders = useSelector(userOrders)
  const assetPrecision = useSelector(pairAssetPrecision)
  const currencyPrecision = useSelector(pairCurrencyPrecision)
  const pairId = useSelector(currentPairIdSelector)
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(false)
  const [targetId, setTargetId] = useState(null)

  const cancelOrder = async id => {
    setDisabled(true)
    setTargetId(id)
    try {
      const status = await signAndSendExtrinsic(
        accountAddress,
        'xSpot',
        'cancelOrder',
        [pairId, id]
      )

      const messages = {
        successTitle: '取消成功',
        failTitle: '取消失败',
        successMessage: `交易hash ${status.txHash}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      setTimeout(() => {
        dispatch(fetchNowOrders(accountId))
        dispatch(fetchQuotations(pairId))
      }, 5000)
    } finally {
      setDisabled(false)
      setTargetId(null)
    }
  }

  return (
    <Table>
      <TableBody>
        {orders.map((order, index) => {
          const currencyPair = order['pair.currency_pair']
          const amount = toPrecision(order.amount, assetPrecision)
          const precision = order['pair.precision']
          const unitPrecision = order['pair.unit_precision']
          const price = toPrecision(order.price, precision, false).toFixed(
            precision - unitPrecision
          )
          const fillPercentage = Number(
            (order.hasfill_amount / order.amount) * 100
          ).toFixed(2)

          return (
            <TableRow key={index}>
              <TimeCell style={{ width: '12%' }}>
                <div>
                  <span className={order.direction} />
                  <span className="time">
                    {moment(order['block.time']).format('YYYY/MM/DD HH:mm')}
                  </span>
                </div>
              </TimeCell>
              <IndexCell style={{ width: '5%' }}>{order.id}</IndexCell>
              <PairCell style={{ width: '8%' }}>{`${currencyPair[0]} / ${
                currencyPair[1]
              }`}</PairCell>
              <NumberCell style={{ width: '11%' }}>
                {price + ' '}
                <span>{currencyPair[1]}</span>
              </NumberCell>
              <NumberCell style={{ width: '13%' }}>
                {amount + ' '}
                <span>{currencyPair[0]}</span>
              </NumberCell>
              <NumberCell style={{ width: '16%' }}>
                {order.direction === 'Sell'
                  ? `${toPrecision(order.reserve_last, currencyPrecision)} `
                  : `${toPrecision(order.reserve_last, assetPrecision)} `}
                <span>{currencyPair[order.direction === 'Sell' ? 1 : 0]}</span>
              </NumberCell>
              <FillCell
                style={{ width: '16%' }}
                className={order.hasfill_amount <= 0 ? 'zero' : order.direction}
              >
                <span className="amount">{`${toPrecision(
                  order.hasfill_amount,
                  assetPrecision
                )}`}</span>
                <span className="percentage"> / {fillPercentage}% </span>
              </FillCell>
              <ActionCell>
                {disabled && targetId === order.id ? (
                  <img
                    src={cancelDisabledIcon}
                    alt="cancel"
                    onClick={() => cancelOrder(order.id)}
                  />
                ) : (
                  <img
                    src={cancelIcon}
                    alt="cancel"
                    onClick={() => cancelOrder(order.id)}
                    className="cancel"
                  />
                )}
              </ActionCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
