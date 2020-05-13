import { createSlice } from '@reduxjs/toolkit'
import { oddEvenContractAddress } from '../utils/constants'
import contractAbiObj from '../utils/oddEvenAbi'
import { Abi } from '@chainx/api-contract'
import { getChainx } from '../services/chainx'
import { stringCamelCase } from '@chainx/util'
import { parseValue } from '../utils/contract'
import { parseParams } from '../utils/contractHelper'

const contractAbi = new Abi(contractAbiObj)

export const betStatusEnum = {
  ON: 'betting', // 投注中
  FILL: 'filled', // 已经开奖
  TO_FILL: 'toFill', // 停止投注，等待开奖
  CLOSE: 'close'
}

const initialState = {
  btcHeight: 627966,
  btcHeaderHash:
    '0000000000000000000ffba85d088a8640bd83785034727dc31d926ed41d87c2',
  betHeight: 700000,
  maxBet: 12000000000,
  status: betStatusEnum.ON,
  bets: {
    odd: 246382.72737627,
    even: 24632.72737627
  },
  myBets: [
    {
      parity: true,
      bet_balance: 62.62736273
    },
    {
      parity: false,
      bet_balance: 100
    }
  ]
}

const oddEvenSlice = createSlice({
  name: 'oddEven',
  initialState,
  reducers: {
    setBetHeight(state, { payload }) {
      state.betHeight = payload
    },
    setOddBets(state, { payload }) {
      state.bets.odd = payload
    },
    setEvenBets(state, { payload }) {
      state.bets.even = payload
    },
    setBets(state, { payload }) {
      state.myBets = payload
    },
    setNowBtc(state, { payload: { height, hash } }) {
      state.btcHeight = height
      state.btcHeaderHash = hash
    },
    setMaxBet(state, { payload }) {
      state.maxBet = payload
    }
  }
})

export const {
  setBetHeight,
  setEvenBets,
  setOddBets,
  setBets,
  setNowBtc,
  setMaxBet
} = oddEvenSlice.actions

async function contractGet(address, method, params = []) {
  parseParams(contractAbi.messages[stringCamelCase(method)].args, params)

  const chainx = getChainx()
  const result = await chainx.api.rpc.chainx.contractCall({
    origin: address,
    dest: oddEvenContractAddress,
    gasLimit: 500000,
    inputData: contractAbi.messages[stringCamelCase(method)](...params)
  })

  return parseValue(
    contractAbi.messages[stringCamelCase(method)].type,
    result.data
  )
}

export const fetchBetBtcHeight = address => async dispatch => {
  const data = await contractGet(address, 'get_bet_block_height')
  dispatch(setBetHeight(data))
}

export const fetchOddBets = address => async dispatch => {
  const data = await contractGet(address, 'get_odd_bet_balance')
  dispatch(setOddBets(data))
}

export const fetchEvenBets = address => async dispatch => {
  const data = await contractGet(address, 'get_even_bet_balance')
  dispatch(setEvenBets(data))
}

export const fetchMaxBet = address => async dispatch => {
  const data = await contractGet(address, 'get_max_bet')
  dispatch(setMaxBet(data))
}

export const fetchBetRecords = address => async dispatch => {
  const data = await contractGet(address, 'get_game_result_from_account', [
    address
  ])
  dispatch(setBets(data))
}

export const fetchNowBtcStatus = isTestNet => async dispatch => {
  const response = await window.fetch(
    `https://api.chainx.org.cn/bitx/${
      isTestNet ? 'testnet' : 'mainnet'
    }/block/tip`
  )
  const result = await response.json()
  dispatch(setNowBtc({ height: result.height, hash: result.hash }))
}

export const nowBtcSelector = state => {
  return {
    height: state.oddEven.btcHeight,
    hash: state.oddEven.btcHeaderHash
  }
}

export const betStatusSelector = state => state.oddEven.status
export const betHeightSelector = state => state.oddEven.betHeight
export const betsSelector = state => state.oddEven.bets
export const myBetsSelector = state => state.oddEven.myBets
export const maxBetSelector = state => state.oddEven.maxBet

export default oddEvenSlice.reducer
