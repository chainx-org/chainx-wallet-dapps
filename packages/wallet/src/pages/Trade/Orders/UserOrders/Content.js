import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableRow } from '@chainx/ui'
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
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../utils/chainxProvider'
import { addressSelector } from '../../../../reducers/addressSlice'
import {
  currentPairIdSelector,
  fetchDexDepth,
  getAccountOrders,
  ordersSelector
} from '@reducers/dexSlice'
import { pairPrecisionSelector } from '@pages/Trade/Module/AskBid/dexSelectors'
import { pcxPrecisionSelector } from '@reducers/assetSlice'
import moment from 'moment'

export default function() {
  const accountAddress = useSelector(addressSelector)

  const pcxPrecision = useSelector(pcxPrecisionSelector)
  const orders = useSelector(ordersSelector)
  const pairId = useSelector(currentPairIdSelector)
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(false)
  const [targetId, setTargetId] = useState(null)

  const pairPrecision = useSelector(pairPrecisionSelector)
  const pairShowPrecision = useSelector(pairPrecisionSelector)

  const cancelOrder = async id => {
    setDisabled(true)
    setTargetId(id)
    try {
      const status = await signAndSendExtrinsic(accountAddress, {
        section: 'xSpot',
        method: 'cancelOrder',
        params: [pairId, id]
      })

      const messages = {
        successTitle: '取消成功',
        failTitle: '取消失败',
        successMessage: ``,
        failMessage: ``
      }

      await showSnack(status, messages, dispatch)
      setTimeout(() => {
        dispatch(getAccountOrders(accountAddress))
        dispatch(fetchDexDepth())
      }, 5000)
    } finally {
      setDisabled(false)
      setTargetId(null)
    }
  }

  return (
    <Table>
      <TableBody>
        {orders.data.map((order, index) => {
          const amount = toPrecision(order.amount, pcxPrecision)
          const price = toPrecision(order.price, pairPrecision, false).toFixed(
            pairShowPrecision
          )
          const fillPercentage = Number(
            (order.alreadyFilled / order.amount) * 100
          ).toFixed(2)

          return (
            <TableRow key={index}>
              <TimeCell style={{ width: '12%' }}>
                <div>
                  <span className={order.side} />
                  <span className="time">
                    {moment(order.blockTime).format('YYYY/MM/DD HH:mm')}
                  </span>
                </div>
              </TimeCell>
              <IndexCell style={{ width: '5%' }}>{order.orderId}</IndexCell>
              <PairCell style={{ width: '8%' }}>PCX/XBTC</PairCell>
              <NumberCell style={{ width: '11%' }}>
                {price + ' '}
                <span>XBTC</span>
              </NumberCell>
              <NumberCell style={{ width: '13%' }}>
                {amount + ' '}
                <span>PCX</span>
              </NumberCell>
              {/*<NumberCell style={{ width: '16%' }}>*/}
              {/*  {order.direction === 'Sell'*/}
              {/*    ? `${toPrecision(order.reserve_last, currencyPrecision)} `*/}
              {/*    : `${toPrecision(order.reserve_last, assetPrecision)} `}*/}
              {/*  <span>{currencyPair[order.direction === 'Sell' ? 0 : 1]}</span>*/}
              {/*</NumberCell>*/}
              <FillCell
                style={{ width: '16%' }}
                className={order.hasfill_amount <= 0 ? 'zero' : order.direction}
              >
                <span className="amount">{`${toPrecision(
                  order.alreadyFilled,
                  pcxPrecision
                )}`}</span>
                <span className="percentage"> / {fillPercentage}% </span>
              </FillCell>
              <ActionCell>
                {disabled && targetId === order.orderId ? (
                  <img
                    src={cancelDisabledIcon}
                    alt="cancel"
                    onClick={() => cancelOrder(order.orderId)}
                  />
                ) : (
                  <img
                    src={cancelIcon}
                    alt="cancel"
                    onClick={() => cancelOrder(order.orderId)}
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
