import React, { useRef, useState } from 'react'
import moment from 'moment'
import { timeFormat } from '../../../../../utils/constants'
import { toPrecision } from '../../../../../utils'
import getState from './State'
import cancelIcon from './cancel.svg'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'
import { fetchWithdrawals } from '../../../../../reducers/crosschainSlice'
import { fetchAccountAssets } from '../../../../../reducers/assetSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
  accountIdSelector,
  xbtcPrecisionSelector
} from '../../../../selectors/assets'
import { addressSelector } from '../../../../../reducers/addressSlice'
import Detail from '../../components/Detail'
import Label from '../../components/Label'
import { Hash } from '../../../../../components'
import BtcAddress from '../../components/BtcAddress'
import useOutsideClick from '../../../../../utils/useClickOutside'
import $t from '../../../../../locale'
import { getChainx } from '../../../../../services/chainx'

export default function({ withdrawal }) {
  const precision = useSelector(xbtcPrecisionSelector)
  const accountAddress = useSelector(addressSelector)
  const dispatch = useDispatch()

  const accountId = useSelector(accountIdSelector)

  const [open, setOpen] = useState(false)

  const chainx = getChainx()
  const revokeWithdraw = async (id, balance) => {
    const extrinsic = chainx.asset.revokeWithdraw(id)
    const status = await signAndSendExtrinsic(accountAddress, extrinsic.toHex())

    const messages = {
      successTitle: '取消提现成功',
      failTitle: '取消提现失败',
      successMessage: `提现数量 ${toPrecision(balance, precision)} BTC`,
      failMessage: `交易hash ${status.txHash}`
    }

    await showSnack(status, messages, dispatch)
    setTimeout(() => {
      dispatch(fetchWithdrawals(accountId))
      dispatch(fetchAccountAssets(accountAddress))
    }, 6000)
  }

  const wrapper = useRef(null)

  useOutsideClick(wrapper, () => {
    setOpen(false)
  })

  return (
    <li onClick={() => setOpen(!open)} ref={wrapper}>
      <header>
        <span>X-BTC</span>
        <span>{moment(withdrawal['block.time']).format(timeFormat)}</span>
      </header>
      <main>
        <span className="text">
          {toPrecision(withdrawal.balance, precision)}
        </span>
        <span className="state">
          <span className="text">{getState(withdrawal.txstate)}</span>
          {withdrawal.txstate === 'Applying' ? (
            <img
              onClick={e => {
                e.stopPropagation()
                revokeWithdraw(withdrawal.id, withdrawal.balance).then(() => {})
              }}
              src={cancelIcon}
              alt="cancel"
            />
          ) : null}
        </span>
      </main>
      {open ? (
        <Detail>
          <li>
            <Label>{$t('ASSET_WITHDRAWAL_TX_ID')}</Label>
            <Hash hash={withdrawal.chainx_tx} />
          </li>
          <li>
            <Label>{$t('COMMON_ADDRESS')}</Label>
            <BtcAddress address={withdrawal.address} />
          </li>
          <li>
            <Label>{$t('COMMON_FEE')}</Label>
            <p className="memo">0.001 X-BTC</p>
          </li>
          <li className="memo">
            <Label>{$t('COMMON_MEMO_SHORT')}</Label>
            <p className="memo">{withdrawal.memo}</p>
          </li>
        </Detail>
      ) : null}
    </li>
  )
}
