import React, { useEffect } from 'react'
import { BetArea, Header, Main, Wrapper } from './styledComponents'
import Logo from './odd-even-logo.svg'
import BtcHash from './components/BtcHash'
import { useDispatch, useSelector } from 'react-redux'
import {
  betHeightSelector,
  betStatusSelector,
  fetchBetBtcHeight,
  fetchBetRecords,
  fetchEvenBets,
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
import { isTestNetSelector } from '../../reducers/settingsSlice'

export default function() {
  const btc = useSelector(nowBtcSelector)
  const betHeight = useSelector(betHeightSelector)
  const status = useSelector(betStatusSelector)
  const openBetBetDialog = useSelector(openBetBetDialogSelector)
  const address = useSelector(addressSelector)
  const isTestNet = useSelector(isTestNetSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBetBtcHeight(address))
    dispatch(fetchOddBets(address))
    dispatch(fetchEvenBets(address))
    dispatch(fetchBetRecords(address))
  }, [address, dispatch])

  useEffect(() => {
    dispatch(fetchNowBtcStatus(isTestNet))
  }, [dispatch, isTestNet])

  return (
    <Wrapper>
      <Header>
        <img src={Logo} alt="logo" />
        <dl>
          <dt>当前 Bitcoin 块高:</dt>
          <dd>{btc.height}</dd>
          <dt>哈希:</dt>
          <dd>
            <BtcHash>{btc.hash}</BtcHash>
          </dd>
        </dl>
      </Header>
      <Main>
        <BetArea>
          <header>
            <span>块高 {betHeight}</span>
            <Status>{status}</Status>
          </header>
          <main>
            <div>
              <h3>
                对 Bitcoin 块高 <span className="height">{betHeight}</span>{' '}
                的交易哈希的 <span>奇/偶</span> 进行投注！
              </h3>
              <Bet />
              <NowBets />
            </div>
            <footer>投注时间截止至 Bitcoin 块高 {betHeight - 5}</footer>
          </main>
        </BetArea>
        <MyBets />
      </Main>
      {openBetBetDialog && <BetDialog />}
    </Wrapper>
  )
}
