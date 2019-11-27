import React, { useState } from 'react'
import { Dialog, TextInput } from '@chainx/ui'
import styled from 'styled-components'
import OpReturnWallet from '../../components/OpReturnWallet'
import infoIcon from '../../../../../static/explan.svg'
import { CheckBox, ClipBoard } from '../../../../../components'
import classnames from 'classnames'
import IntentionSelect from '../../../../../components/IntentionSelect'
import { u8aToHex } from '@polkadot/util'
import { useSelector } from 'react-redux'
import { addressSelector } from '../../../../../reducers/addressSlice'
import { default as WAValidator } from 'wallet-address-validator'
import { networkSelector } from '../../../../../reducers/settingsSlice'

const StyledDialog = styled(Dialog)`
  main.content {
    padding: 16px;

    h1 {
      margin: 0 0 8px;
      &:not(:first-of-type) {
        margin-top: 16px;
      }
      opacity: 0.72;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;
      span.step {
        color: #ecb417;
        margin-right: 8px;
      }
    }

    p {
      opacity: 0.56;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;
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

    section.code {
      margin-top: 12px;
      background: #f2f3f4;
      border: 1px solid #dce0e2;
      border-radius: 6px;
      padding: 14px 12px;

      h3 {
        display: flex;
        justify-content: space-between;
        margin: 0;
        opacity: 0.72;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
        &.hex {
          margin-bottom: 8px;
        }

        span.title {
          font-weight: 500;
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
  }
`

export default function({ handleClose }) {
  const network = useSelector(networkSelector)

  const [btcAddress, setBtcAddress] = useState('')
  const [checked, setChecked] = useState(false)
  const [channel, setChannel] = useState('')
  const address = useSelector(addressSelector)
  const [btcAddressErrMsg, setBtcAddressErrMsg] = useState('')

  const addressHex = u8aToHex(
    new TextEncoder('utf-8').encode(
      `ChainX:${address}${channel ? '@' + channel : ''}:${btcAddress.slice(
        0,
        4
      )}`
    )
  ).replace(/^0x/, '')

  const checkBtcAddress = () => {
    if (!btcAddress) {
      return
    }

    const valid = WAValidator.validate(
      btcAddress,
      'BTC',
      network === 'testnet' ? 'testnet' : 'prod'
    )
    if (!valid) {
      setBtcAddressErrMsg('地址格式错误')
    } else if (!['1', '3'].includes(btcAddress[0]) && network === 'mainnet') {
      setBtcAddressErrMsg('锁仓的BTC地址必须以1或3开头')
    }
  }

  const btcAddressValid = !!btcAddress && btcAddressErrMsg.length <= 0

  return (
    <StyledDialog open title={'跨链锁仓'} handleClose={handleClose}>
      <main className="content">
        <h1>
          <span className="step">第一步</span>
          <span className="text">创建锁仓地址</span>
        </h1>
        <p>
          使用任意钱包创建 1 或 3 开头的 BTC
          地址用于存放锁仓资金。请注意使用该钱包的任意转出操作都可能花费锁仓金额，从而导致该笔锁仓挖矿停止。
        </p>
        <h1>
          <span className="step">第二步</span>
          <span className="text">生成 OP_RETURN</span>
        </h1>
        <p>输入你创建的 BTC 锁仓地址。</p>
        <div style={{ marginTop: 8 }}>
          <TextInput
            value={btcAddress}
            onChange={value => {
              setBtcAddressErrMsg('')
              setBtcAddress(value)
            }}
            onBlur={checkBtcAddress}
            placeholder={'BTC 锁仓地址'}
            error={!!btcAddressErrMsg}
            errorText={btcAddressErrMsg}
          />
        </div>
        <section className="code">
          <h3 className={classnames({ hex: btcAddress })}>
            <span className="title">OP_RETURN</span>
            {btcAddressValid ? (
              <CheckBox
                checked={checked}
                onClick={() => setChecked(!checked)}
                className="channel"
              >
                添加渠道 (选填)
              </CheckBox>
            ) : (
              <span className="text">请在上方输入 BTC 锁仓地址</span>
            )}
          </h3>
          {checked && btcAddressValid ? (
            <IntentionSelect
              value={channel}
              onChange={setChannel}
              style={{ marginBottom: 8 }}
            />
          ) : null}
          {btcAddressValid ? (
            <ClipBoard className="hex">{addressHex}</ClipBoard>
          ) : null}
        </section>

        <h1>
          <span className="step">第三步</span>
          <span className="text">发起锁仓交易</span>
        </h1>
        <p>
          使用支持 OP_RETURN 的钱包向锁仓地址转账（转账金额即锁仓金额），并输入
          OP_RETURN 信息。
        </p>
        <ul className={'info'}>
          <li>
            <img src={infoIcon} alt="info" />
            <span>单笔 BTC 锁仓金额必须 >=0.01 BTC；</span>
          </li>
          <li>
            <img src={infoIcon} alt="info" />
            <span>{'单个 BTC 锁仓地址总额必须 <=10 BTC；'}</span>
          </li>
          <li>
            <img src={infoIcon} alt="info" />
            <span>单个 ChainX 地址锁仓总额不限。</span>
          </li>
        </ul>
        <OpReturnWallet />
      </main>
    </StyledDialog>
  )
}
