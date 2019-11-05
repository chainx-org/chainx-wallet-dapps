import React, { useState } from 'react'
import Logo from './components/Logo'
import xbtcIcon from '../../static/xbtc.svg'
import lbtcIcon from '../../static/lbtc.svg'
import sdotIcon from '../../static/sdot.svg'
import Interest from './components/Interest'
import { token as tokens } from '../../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { xbtcInterestSelector } from './XbtcCard/selectors'
import { sdotInterestSelector } from './SdotCard/selectors'
import { lbtcInterestSelector } from './LbtcCard/selectors'
import {
  addressSelector,
  isExtensionSelector
} from '../../reducers/addressSlice'
import { signAndSendExtrinsic } from '../../utils/chainxProvider'
import {
  addSnack,
  generateId,
  removeSnackInSeconds,
  typeEnum
} from '../../reducers/snackSlice'
import { pcxPrecisionSelector } from '../selectors/assets'

export default function({ token }) {
  const accountAddress = useSelector(addressSelector)
  const isFromExtension = useSelector(isExtensionSelector)

  const [disabled, setDisabled] = useState(false)

  const xbtcInterest = useSelector(xbtcInterestSelector)
  const sdotInterest = useSelector(sdotInterestSelector)
  const lbtcInterest = useSelector(lbtcInterestSelector)

  const precision = useSelector(pcxPrecisionSelector)

  const dispatch = useDispatch()

  let interest = xbtcInterest
  let icon = xbtcIcon
  if (token === tokens.SDOT) {
    interest = sdotInterest
    icon = sdotIcon
  } else if (token === tokens.LBTC) {
    interest = lbtcInterest
    icon = lbtcIcon
  }

  const showInterest =
    typeof interest === 'number' && typeof precision === 'number'
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

  return (
    <>
      <Logo icon={icon} name={token === tokens.XBTC ? 'X-BTC' : token} />
      {showInterest && (
        <Interest
          disabled={!hasInterest || disabled}
          interest={interest}
          precision={precision}
          claim={() => claim(token)}
          token={token}
        />
      )}
    </>
  )
}
