import { useEffect } from 'react'
import {
  fetchBalance,
  fetchBetBtcHeight,
  fetchBetRecords,
  fetchBetStatus,
  fetchEvenBets,
  fetchEvenRankingList,
  fetchIsRewarded,
  fetchMaxBet,
  fetchMinBet,
  fetchOddBets,
  fetchOddRankingList
} from '../../reducers/oddevenSlice'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from '../../reducers/addressSlice'

export function useFetchOddEvenInfo() {
  const address = useSelector(addressSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBetBtcHeight(address))
    dispatch(fetchOddBets(address))
    dispatch(fetchEvenBets(address))
    dispatch(fetchBetRecords(address))
    dispatch(fetchMaxBet(address))
    dispatch(fetchMinBet(address))
    dispatch(fetchBetStatus(address))
    dispatch(fetchIsRewarded(address))

    dispatch(fetchEvenRankingList(address))
    dispatch(fetchOddRankingList(address))

    dispatch(fetchBalance(address))
  }, [address, dispatch])
}
