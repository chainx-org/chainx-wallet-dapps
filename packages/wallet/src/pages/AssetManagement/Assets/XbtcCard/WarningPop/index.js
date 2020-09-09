import React, { useRef } from 'react'
import { noneFunc, toPrecision } from '../../../../../utils'
import useOutsideClick from '../../../../../utils/useClickOutside'
import { Wrapper } from './styledComponents'
import { useSelector } from 'react-redux'
import { locksSelector, pcxPrecisionSelector } from '@reducers/assetSlice'
import { xbtcInterestSelector } from '@reducers/miningAssetSlice'
import {
  btcNextClaimSelector,
  nextClaimDistanceSelector,
  reachClaimHeightSelector
} from '@pages/AssetManagement/Assets/XbtcCard/selectors'
import successIcon from './success.svg'
import warningIcon from './warning.svg'
import $t from '@locale/index'
import moment from 'moment'
import { blockDuration, timeFormat } from '../../../../../utils/constants'

export default function({ close = noneFunc }) {
  const popup = useRef(null)

  useOutsideClick(popup, () => {
    close()
  })

  const { Bonded: bonded } = useSelector(locksSelector)
  const xbtcInterest = useSelector(xbtcInterestSelector)
  const hasEnoughStaking = bonded > (xbtcInterest * 100) / 9
  const needStakingPcx = (xbtcInterest * 100) / 9 - bonded

  const reachClaimHeight = useSelector(reachClaimHeightSelector)
  const nextClaimDistance = useSelector(nextClaimDistanceSelector)

  const nextClaim = useSelector(btcNextClaimSelector)
  const nextTime = nextClaimDistance * blockDuration + new Date().getTime()

  const precision = useSelector(pcxPrecisionSelector)

  return (
    <Wrapper ref={popup}>
      <ul>
        <li>
          <h3>
            <img
              src={reachClaimHeight ? successIcon : warningIcon}
              alt="icon"
            />
            <span>{$t('PSEDU_CLAIM_INTERVAL')}</span>
          </h3>
          {reachClaimHeight ? null : (
            <div style={{ marginBottom: 8 }}>
              <header>{$t('PSEDU_NEXT_CLAIM_HEIGHT')}</header>
              <p>
                {nextClaim}（{$t('PSEDU_ESTIMATE')}{' '}
                {moment(nextTime).format(timeFormat)}）
              </p>
            </div>
          )}
        </li>
        <li>
          <h3>
            <img
              src={hasEnoughStaking ? successIcon : warningIcon}
              alt="icon"
            />
            <span>{$t('PSEDU_CLAIM_REQU_VOTE')}</span>
          </h3>
          {hasEnoughStaking ? null : (
            <div>
              <header>{$t('PSEDU_TO_ADD_VOTE')}</header>
              <p>{toPrecision(needStakingPcx, precision)}PCX</p>
            </div>
          )}
        </li>
      </ul>
    </Wrapper>
  )
}
