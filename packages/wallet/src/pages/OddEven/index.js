import React, { useEffect, useState } from 'react'
import { BetArea, Header, Main, Wrapper } from './styledComponents'
import Logo from './odd-even-logo.svg'
import BtcHash from './components/BtcHash'
import { useDispatch, useSelector } from 'react-redux'
import {
  betHeightSelector,
  betStatusSelector,
  fetchBetBtcHeight,
  fetchBetRecords,
  fetchBetStatus,
  fetchEvenBets,
  fetchMaxBet,
  fetchMinBet,
  fetchNowBtcStatus,
  fetchOddBets,
  nowBtcSelector
} from '../../reducers/oddevenSlice'
import Status from './Status'
import Bet from './Bet'
import NowBets from './NowBets'
import MyBets from './MyBets'
import BetDialog from './BetDialog'
import { openBetBetDialogSelector } from '../../reducers/runStatusSlice'
import { addressSelector } from '../../reducers/addressSlice'
import { isTestNetSelector, localeSelector } from '../../reducers/settingsSlice'
import $t from '../../locale'
import Rule from './Rule'
import RuleDialog from './Rule/Dialog'

export default function() {
  const btc = useSelector(nowBtcSelector)
  const betHeight = useSelector(betHeightSelector)
  const status = useSelector(betStatusSelector)
  const openBetBetDialog = useSelector(openBetBetDialogSelector)
  const address = useSelector(addressSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const locale = useSelector(localeSelector)
  const [openRuleDialog, setOpenRuleDialog] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBetBtcHeight(address))
    dispatch(fetchOddBets(address))
    dispatch(fetchEvenBets(address))
    dispatch(fetchBetRecords(address))
    dispatch(fetchMaxBet(address))
    dispatch(fetchMinBet(address))
    dispatch(fetchBetStatus(address))
  }, [address, dispatch])

  useEffect(() => {
    dispatch(fetchNowBtcStatus(isTestNet))
  }, [dispatch, isTestNet])

  return (
    <Wrapper>
      <Header>
        <div>
          <img src={Logo} alt="logo" />
          <dl>
            <dt>{$t('PREDICT_NOW_BTC_HEIGHT')}</dt>
            <dd>{btc.height}</dd>
            <dt>{$t('PREDICT_NOW_BTC_HASH')}</dt>
            <dd>
              <BtcHash>{btc.hash}</BtcHash>
            </dd>
          </dl>
        </div>
        <Rule onClick={() => setOpenRuleDialog(true)} />
      </Header>
      <Main>
        <BetArea>
          <header>
            <span>{$t('PREDICT_BET_HEIGHT', { height: betHeight })}</span>
            <Status>{status}</Status>
          </header>
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
            </div>
            <footer>
              {$t('PREDICT_DEAL_HEIGHT', { height: betHeight - 5 })}
            </footer>
          </main>
        </BetArea>
        <MyBets />
      </Main>
      {openBetBetDialog && <BetDialog />}
      {openRuleDialog && (
        <RuleDialog handleClose={() => setOpenRuleDialog(false)} />
      )}
    </Wrapper>
  )
}
