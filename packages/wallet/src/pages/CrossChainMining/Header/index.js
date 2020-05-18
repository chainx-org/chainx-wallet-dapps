import React, { useState } from 'react'
import Logo from '../components/Logo'
import xbtcIcon from '../../../static/xbtc.svg'
import lbtcIcon from '../../../static/lbtc.svg'
import sdotIcon from '../../../static/sdot.svg'
import Interest from '../components/Interest'
import { token as tokens } from '../../../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import {
  xbtcClaimInfoSelector,
  xbtcInterestSelector
} from '../XbtcCard/selectors'
import {
  sdotClaimInfoSelector,
  sdotInterestSelector
} from '../SdotCard/selectors'
import {
  lbtcClaimInfoSelector,
  lbtcInterestSelector
} from '../LbtcCard/selectors'
import { addressSelector } from '../../../reducers/addressSlice'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { pcxPrecisionSelector } from '../../selectors/assets'
import { fetchPseduNominationRecords } from '../../../reducers/intentionSlice'
import { isDemoSelector } from '../../../selectors'
import { getChainx } from '../../../services/chainx'
import { canRequestSign, retry, toPrecision } from '../../../utils'
import { fetchAccountAssets } from '../../../reducers/assetSlice'
import $t from '../../../locale'
import { useIsMounted } from '../../../utils/hooks'

export default function({ token }) {
  const accountAddress = useSelector(addressSelector)

  const [disabled, setDisabled] = useState(false)

  const xbtcInterest = useSelector(xbtcInterestSelector)
  const sdotInterest = useSelector(sdotInterestSelector)
  const lbtcInterest = useSelector(lbtcInterestSelector)

  const xbtcClaimInfo = useSelector(xbtcClaimInfoSelector)
  const sdotClaimInfo = useSelector(sdotClaimInfoSelector)
  const lbtcClaimInfo = useSelector(lbtcClaimInfoSelector)

  const precision = useSelector(pcxPrecisionSelector)

  const dispatch = useDispatch()

  let interest = xbtcInterest
  let icon = xbtcIcon
  let claimInfo = xbtcClaimInfo
  if (token === tokens.SDOT) {
    interest = sdotInterest
    icon = sdotIcon
    claimInfo = sdotClaimInfo
  } else if (token === tokens.LBTC) {
    interest = lbtcInterest
    icon = lbtcIcon
    claimInfo = lbtcClaimInfo
  }

  const showInterest =
    typeof interest === 'number' && typeof precision === 'number'

  const chainx = getChainx()

  const mounted = useIsMounted()

  async function claim(token) {
    if (!canRequestSign()) {
      return
    }

    if (showInterest && interest <= 0) {
      return
    }

    setDisabled(true)
    try {
      const extrinsic = chainx.stake.depositClaim(token)
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )

      const claimedMsg = do {
        if (status.result === 'ExtrinsicFailed') {
          return null
        } else {
          const {
            event: { data: dataArr = [] }
          } = status.events.find(e => e.method === 'DepositorClaim')
          $t('PSEDU_CLAIM_AMOUNT', {
            amount: toPrecision(dataArr[dataArr.length - 1], precision, false)
          })
        }
      }

      let hashMsg = `交易hash ${status.txHash}`
      const messages = {
        successTitle: $t('COMMON_MSG_SUCCESS', { msg: $t('STAKING_CLAIM') }),
        failTitle: $t('COMMON_MSG_Fail', { msg: $t('STAKING_CLAIM') }),
        successMessage: claimedMsg,
        failMessage: hashMsg
      }
      await showSnack(status, messages, dispatch)

      retry(
        () => {
          dispatch(fetchPseduNominationRecords(accountAddress))
          dispatch(fetchAccountAssets(accountAddress))
        },
        5,
        2
      ).then(() =>
        console.log('Refresh psedu nomination records 5 times after claim')
      )
    } finally {
      if (mounted.current) {
        setDisabled(false)
      }
    }
  }

  const isDemo = useSelector(isDemoSelector)

  return (
    <>
      <Logo icon={icon} name={token === tokens.XBTC ? 'X-BTC' : token} />
      {showInterest && (
        <Interest
          disabled={isDemo || disabled}
          interest={interest}
          precision={precision}
          claim={() => claim(token)}
          claimInfo={claimInfo}
          token={token}
        />
      )}
    </>
  )
}
