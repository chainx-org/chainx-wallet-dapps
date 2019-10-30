import React from 'react'
import { Dialog } from '@chainx/ui'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { u8aToHex } from '@polkadot/util'
import { ClipBoard } from '../../../../../components'
import infoIcon from '../../../../../static/explan.svg'

const StyledDialog = styled(Dialog)`
  main.content {
    padding: 16px;

    section.code {
      margin-top: 12px;
      background: #f2f3f4;
      border: 1px solid #dce0e2;
      border-radius: 6px;
      padding: 14px 12px;

      h3 {
        margin: 0 0 8px;
        opacity: 0.72;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
        span.title {
          font-weight: 500;
        }
      }

      .hex {
        opacity: 0.32;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
      }
    }

    ul {
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
  const address = useSelector(addressSelector)
  const addressHex = u8aToHex(new TextEncoder('utf-8').encode(address)).replace(
    /^0x/,
    ''
  )

  return (
    <StyledDialog open title={'跨链充值'} handleClose={handleClose}>
      <main className="content">
        <h1>
          <span className="step">第一步</span>
          <span className="text">获取 OP_RETURN</span>
        </h1>
        <p className={'op-return'}>
          获取含有 16 进制 ChainX 地址的 OP_RETURN 信息。
        </p>
        <section className="code">
          <h3>
            <span className="title">OP_RETURN</span>
          </h3>
          <ClipBoard className="hex">{addressHex}</ClipBoard>
        </section>
        <h1 className="step-2">
          <span className="step">第二步</span>
          <span className="text">发起跨链提现</span>
        </h1>
        <p className="input">
          使用支持 OP_RETURN 的钱包向信托热多签地址充值，并输入 OP_RETURN 信息。
        </p>
        <ul>
          <li>
            <img src={infoIcon} alt="info" />
            <span>充值金额必须 >=0.001 BTC；</span>
          </li>
          <li>
            <img src={infoIcon} alt="info" />
            <span>目前仅支持 1 和 3 开头的 BTC 地址发起的跨链充值；</span>
          </li>
          <li>
            <img src={infoIcon} alt="info" />
            <span>类似 imToken 钱包的 memo 不是 OP_RETURN。</span>
          </li>
        </ul>
      </main>
    </StyledDialog>
  )
}
