import React, { useState } from 'react'
import Logo from '../components/Logo'
import icon from '../../../static/xbtc.svg'
import CardWrapper from '../components/CardWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { normalizedXbtcSelector } from '../selectors'
import $t from '../../../locale'
import { xbtcInterestSelector } from './selectors'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { toPrecision } from '../../../utils'
import styled from 'styled-components'
import { PrimaryButton } from '@chainx/ui'
import {
  addressSelector,
  isExtensionSelector
} from '../../../reducers/addressSlice'
import {
  addSnack,
  generateId,
  removeSnackInSeconds,
  typeEnum
} from '../../../reducers/snackSlice'
import { signAndSendExtrinsic } from '../../../utils/chainxProvider'

const Interest = styled.section`
  display: flex;
  align-items: center;
  label {
    opacity: 0.32;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.2px;
    line-height: 16px;
    margin-right: 8px;
  }
  span {
    opacity: 0.72;
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 24px;
    min-width: 200px;
  }
  button {
    width: 84px;
    span {
      width: 84px !important;
      font-size: 14px !important;
    }
  }
`

export default function() {
  const accountAddress = useSelector(addressSelector)
  const isFromExtension = useSelector(isExtensionSelector)
  const xbtc = useSelector(normalizedXbtcSelector)
  const interest = useSelector(xbtcInterestSelector)
  const precision = useSelector(pcxPrecisionSelector)

  const showInterest =
    typeof interest === 'number' && typeof precision === 'number'
  const [disabled, setDisabled] = useState(true)
  const dispatch = useDispatch()

  const hasInterest = showInterest && interest > 0

  function claim(token) {
    if (!isFromExtension) {
      console.error('not extension account')
      return
    }

    if (showInterest && interest <= 0) {
      return
    }

    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    setDisabled(true)
    signAndSendExtrinsic(accountAddress, 'xTokens', 'claim', [token])
      .then(status => {
        let type = typeEnum.SUCCESS
        let title =
          status.result === 'ExtrinsicSuccess' ? '提息成功' : '提息失败'
        let message = `交易hash ${status.txHash}`

        if (status.result === 'ExtrinsicFailed') {
          type = typeEnum.ERROR
        }

        setDisabled(false)
        let id = generateId()
        dispatch(addSnack({ id, type, title, message }))
        removeSnackInSeconds(dispatch, id, 5)
      })
      .catch(() => setDisabled(false))
  }

  const header = (
    <>
      <Logo icon={icon} name={'X-BTC'} />
      {showInterest && (
        <Interest>
          <label>代提利息</label>
          <span>{toPrecision(interest, precision)} PCX</span>
          <PrimaryButton
            disabled={!hasInterest || disabled}
            size="small"
            onClick={() => claim('BTC')}
          >
            提息
          </PrimaryButton>
        </Interest>
      )}
    </>
  )

  const details = (
    <ul>
      <li>
        <header>{$t('PSEDU_CIRCULATION')}</header>
        <p>{xbtc.circulation}</p>
      </li>
      <li>
        <header>{$t('PSEDU_POWER')}（PCX）</header>
        <p>{xbtc.power}</p>
      </li>
      <li>
        <header>{$t('PSEDU_EQUIVALENT')}（PCX）</header>
        <p>{xbtc.vote}</p>
      </li>
      <li>
        <header>{$t('PSEDU_JACKPOT')}（PCX）</header>
        <p>{xbtc.jackpot}</p>
      </li>
      <li>
        <header>{$t('PSEDU_BALANCE')}</header>
        <p>{xbtc.balance}</p>
      </li>
    </ul>
  )

  return <CardWrapper header={header} detail={details}></CardWrapper>
}
