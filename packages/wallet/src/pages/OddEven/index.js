import React, { useEffect, useState } from 'react'
import { BetArea, Main, Wrapper } from './styledComponents'
import { useDispatch, useSelector } from 'react-redux'
import {
  betHeightSelector,
  betStatusEnum,
  betStatusSelector,
  fetchNowBtcStatus,
  fetchWinValue,
  isRewardedSelector,
  winValueSelector
} from '../../reducers/oddevenSlice'
import Bet from './Bet'
import NowBets from './NowBets'
import MyBets from './MyBets'
import BetDialog from './BetDialog'
import { openBetBetDialogSelector } from '../../reducers/runStatusSlice'
import { addressSelector } from '../../reducers/addressSlice'
import { isTestNetSelector, localeSelector } from '../../reducers/settingsSlice'
import $t from '../../locale'
import RuleDialog from './Rule/Dialog'
import { pcxPrecisionSelector } from '../selectors/assets'
import { toPrecision } from '../../utils'
import OddEvenHeader from './Head'
import Rankings from './Rankings'
import Rule from './Rule'
import { useFetchOddEvenInfo } from './utils'
import WithDrawDialog from './WithdrawDialog'
import DepositDialog from './DepositDialog'
import BetAreaHeader from './BetAreaHeader'

export default function() {
  const betHeight = useSelector(betHeightSelector)
  const status = useSelector(betStatusSelector)
  const openBetBetDialog = useSelector(openBetBetDialogSelector)
  const address = useSelector(addressSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const locale = useSelector(localeSelector)
  const [openRuleDialog, setOpenRuleDialog] = useState(false)
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false)
  const [openDepositDialog, setOpenDepositDialog] = useState(false)

  const isRewarded = useSelector(isRewardedSelector)
  // const winValue = (
  //   winValues.find(v => v.account === address) || { win_balance: 0 }
  // ).win_balance
  const winValue = useSelector(winValueSelector)
  const precision = useSelector(pcxPrecisionSelector)

  const dispatch = useDispatch()
  useFetchOddEvenInfo()

  useEffect(() => {
    if (isRewarded) {
      dispatch(fetchWinValue(address))
    }
  }, [dispatch, isRewarded, address])

  useEffect(() => {
    dispatch(fetchNowBtcStatus())
  }, [dispatch, isTestNet])

  return (
    <Wrapper>
      <OddEvenHeader
        withdraw={() => setOpenWithdrawDialog(true)}
        deposit={() => setOpenDepositDialog(true)}
      />
      <Main>
        <BetArea>
          <BetAreaHeader />
          <main>
            <div>
              {locale === 'en' ? (
                <h3>
                  Bet <span>Odd/Even</span> of Bitcoin Block{' '}
                  <span className="height">{betHeight}</span> Header Hash
                </h3>
              ) : (
                <h3>
                  对 Bitcoin 块高 <span className="height">{betHeight}</span>{' '}
                  的交易哈希的 <span>奇/偶</span> 进行投注！
                </h3>
              )}
              <Bet />
              <NowBets />
              {status === betStatusEnum.FILL && (
                <div className="value">
                  <p>
                    {$t('PREDICT_WIN_VALUE')}
                    {': '}
                    <span>{toPrecision(winValue, precision)} PCX</span>
                  </p>
                </div>
              )}
            </div>
            <footer>
              <p style={{ marginBottom: 8 }}>
                {$t('PREDICT_DEAL_HEIGHT', {
                  height: betHeight - 20 < 0 ? 0 : betHeight - 20
                })}
              </p>
              <Rule onClick={() => setOpenRuleDialog(true)} />
            </footer>
          </main>
        </BetArea>
        <Rankings />
        <MyBets />
      </Main>
      {openBetBetDialog && <BetDialog />}
      {openRuleDialog && (
        <RuleDialog handleClose={() => setOpenRuleDialog(false)} />
      )}
      {openWithdrawDialog && (
        <WithDrawDialog handleClose={() => setOpenWithdrawDialog(false)} />
      )}
      {openDepositDialog && (
        <DepositDialog handleClose={() => setOpenDepositDialog(false)} />
      )}
    </Wrapper>
  )
}
