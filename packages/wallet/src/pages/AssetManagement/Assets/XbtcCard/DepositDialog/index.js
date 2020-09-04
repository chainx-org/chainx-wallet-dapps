import React, { useEffect, useState } from 'react'
import { Dialog } from '@chainx/ui'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { u8aToHex } from '@polkadot/util'
import { ClipBoard } from '../../../../../components'
import infoIcon from '../../../../../static/explan.svg'
import {
  fetchTrusteeSessionInfo,
  hotAddressSelector
} from '../../../../../reducers/trustSlice'
import OpReturnWallet from '../../components/OpReturnWallet'
import $t from '../../../../../locale'

const StyledDialog = styled(Dialog)`
  main.content {
    padding: 16px;

    section.show-code {
      margin-top: 12px;
      background: #f2f3f4;
      border: 1px solid #dce0e2;
      border-radius: 6px;
      padding: 14px 12px;

      h3 {
        display: flex;
        justify-content: space-between;
        margin: 0 0 8px;
        opacity: 0.72;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
        span.title {
          font-weight: 500;
        }

        span.addr {
          opacity: 0.32;
          font-size: 13px;
          font-weight: 400;
          color: #000000;
          letter-spacing: 0.2px;
          text-align: right;
          line-height: 18px;
        }

        .channel span {
          opacity: 0.56;
          font-size: 13px;
          color: #000000;
          letter-spacing: 0.2px;
          text-align: right;
          line-height: 18px;
        }
      }

      .hex {
        margin-top: 8px;
        opacity: 0.32;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
      }
    }

    ul.info {
      margin-top: 12px;
      li {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          margin-right: 6px;
        }

        &:not(:first-of-type) {
          margin-top: 6px;
        }

        opacity: 0.56;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;
      }
    }
  }

  h1 {
    margin: 0;
    opacity: 0.72;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
    span.step {
      color: #ecb417;
      margin-right: 8px;
    }
    &.step-2 {
      margin-top: 16px;
    }
  }

  p {
    opacity: 0.56;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
    &.op-return,
    &.input {
      margin-top: 8px;
    }
  }
`

export default function({ handleClose }) {
  // const [checked, setChecked] = useState(false)
  const address = useSelector(addressSelector)

  const trusteeHotAddress = useSelector(hotAddressSelector)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchTrusteeSessionInfo())
  }, [dispatch])

  const [channel] = useState('')
  const addressHex = u8aToHex(
    new TextEncoder('utf-8').encode(`${address}${channel ? '@' + channel : ''}`)
  ).replace(/^0x/, '')

  return (
    <StyledDialog
      open
      title={$t('ASSET_CROSS_CHAIN_DEPOSIT_2')}
      handleClose={handleClose}
    >
      <main className="content">
        <h1>
          <span className="step">{$t('ASSET_STEP_ONE')}</span>
          <span className="text">{$t('ASSET_GET_OP_RETURN')}</span>
        </h1>
        <p className={'op-return'}>{$t('ASSET_GET_OP_RETURN_DETAIL')}</p>
        <section className="show-code">
          {/*<h3>*/}
          {/*  <span className="title">OP_RETURN</span>*/}
          {/*  <CheckBox*/}
          {/*    checked={checked}*/}
          {/*    onClick={() => setChecked(!checked)}*/}
          {/*    className="channel"*/}
          {/*  >*/}
          {/*    {$t('ASSET_ADD_REFERRER')}*/}
          {/*  </CheckBox>*/}
          {/*</h3>*/}
          {/*{checked ? (*/}
          {/*  <IntentionSelect*/}
          {/*    value={channel}*/}
          {/*    onChange={setChannel}*/}
          {/*    style={{ marginBottom: 8 }}*/}
          {/*  />*/}
          {/*) : null}*/}
          <ClipBoard className="hex">{addressHex}</ClipBoard>
        </section>
        <h1 className="step-2">
          <span className="step">{$t('ASSET_STEP_TWO')}</span>
          <span className="text">{$t('ASSET_DO_CROSS_CHAIN_DEPOSIT')}</span>
        </h1>
        <p className="input">{$t('ASSET_DO_CROSS_CHAIN_DEPOSIT_DETAIL')}</p>
        <ul className={'info'}>
          <li>
            <img src={infoIcon} alt="info" />
            <span>{$t('ASSET_DEPOSIT_REQUIREMENT_AMOUNT')}</span>
          </li>
          <li>
            <img src={infoIcon} alt="info" />
            <span>{$t('ASSET_DEPOSIT_REQUIREMENT_ADDR')}</span>
          </li>
        </ul>
        <section className="show-code">
          <h3 style={{ marginBottom: 0 }}>
            <span className="title">{$t('ASSET_TRUEST_HOT_ADDR')}</span>
            <ClipBoard className={'addr'}>{trusteeHotAddress}</ClipBoard>
          </h3>
        </section>
        <OpReturnWallet />
      </main>
    </StyledDialog>
  )
}
