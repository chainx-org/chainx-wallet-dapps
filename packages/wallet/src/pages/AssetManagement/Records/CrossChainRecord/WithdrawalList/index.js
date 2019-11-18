import React, { useEffect } from 'react'
import {
  fetchWithdrawals,
  withdrawalsSelector
} from '../../../../../reducers/crosschainSlice'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { xbtcPrecisionSelector } from '../../../../selectors/assets'
import { getChainx } from '../../../../../services/chainx'
import styled from 'styled-components'
import { Empty } from '../../../../../components'
import moment from 'moment'
import { timeFormat } from '../../../../../utils/constants'
import { toPrecision } from '../../../../../utils'
import cancelIcon from './cancel.svg'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../utils/chainxProvider'

const Wrapper = styled.div`
  & > div {
    margin-top: 30px;
  }

  ul {
    li {
      &:not(:first-of-type) {
        border-top: 1px solid #eee;
      }

      padding: 10px 16px;
      header,
      main {
        display: flex;
        justify-content: space-between;
      }
      header {
        opacity: 0.32;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;
      }

      main {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 500;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;

        span.text {
          opacity: 0.72;
        }

        .state {
          display: flex;
          img {
            margin-left: 8px;
            cursor: pointer;
          }
        }
      }
    }
  }
`

export default function() {
  const dispatch = useDispatch()
  const address = useSelector(addressSelector)
  const withdrawals = useSelector(withdrawalsSelector)
  const precision = useSelector(xbtcPrecisionSelector)
  const accountAddress = useSelector(addressSelector)

  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address, false)

  useEffect(() => {
    dispatch(fetchWithdrawals(accountId))
  }, [dispatch, accountId])

  const revokeWithdraw = async (id, balance) => {
    const status = await signAndSendExtrinsic(
      accountAddress,
      'xAssetsProcess',
      'revokeWithdraw',
      [id]
    )

    const messages = {
      successTitle: '取消提现成功',
      failTitle: '取消提现失败',
      successMessage: `提现数量 ${toPrecision(balance, precision)} BTC`,
      failMessage: `交易hash ${status.txHash}`
    }

    await showSnack(status, messages, dispatch)
    setTimeout(() => {
      dispatch(fetchWithdrawals(accountId))
    }, 3000)
  }

  const withdrawalsElement = (
    <ul>
      {(withdrawals || []).map((withdrawal, index) => {
        return (
          <li key={index}>
            <header>
              <span>X-BTC</span>
              <span>{moment(withdrawal['block.time']).format(timeFormat)}</span>
            </header>
            <main>
              <span className="text">
                {toPrecision(withdrawal.balance, precision)}
              </span>
              <span className="state">
                <span className="text">{withdrawal.txstate}</span>
                {withdrawal.txstate === 'Applying' ? (
                  <img
                    onClick={() =>
                      revokeWithdraw(withdrawal.id, withdrawal.balance)
                    }
                    src={cancelIcon}
                    alt="cancel"
                  />
                ) : null}
              </span>
            </main>
          </li>
        )
      })}
    </ul>
  )

  return (
    <Wrapper>
      {(withdrawals || []).length > 0 ? (
        withdrawalsElement
      ) : (
        <div>
          <Empty text="暂无提现记录" />
        </div>
      )}
    </Wrapper>
  )
}
