import { createSlice } from '@reduxjs/toolkit'
import { oddEvenContractAddress } from '../utils/constants'
import contractAbiObj from '../utils/oddEvenAbi'
import { Abi } from '@chainx/api-contract'
import { getChainx } from '../services/chainx'
import { stringCamelCase } from '@chainx/util'
import { parseValue } from '../utils/contract'

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
  dealHeight: 627992,
  status: betStatusEnum.ON,
  bets: {
    odd: 246382.72737627,
    even: 24632.72737627
  },
  myBets: [
    {
      isEven: true,
      amount: 62.62736273
    },
    {
      isEven: false,
      amount: 100
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
    }
  }
})

export const { setBetHeight, setEvenBets, setOddBets } = oddEvenSlice.actions

async function contractGet(address, method, params = null) {
  const chainx = getChainx()
  const result = await chainx.api.rpc.chainx.contractCall({
    origin: address,
    dest: oddEvenContractAddress,
    gasLimit: 500000,
    inputData: contractAbi.messages[stringCamelCase(method)]()
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

export const nowBtcSelector = state => {
  return {
    height: state.oddEven.btcHeight,
    hash: state.oddEven.btcHeaderHash
  }
}

export const betStatusSelector = state => state.oddEven.status
export const betHeightSelector = state => state.oddEven.betHeight
export const betsSelector = state => state.oddEven.bets
export const dealHeightSelector = state => state.oddEven.dealHeight
export const myBetsSelector = state => state.oddEven.myBets

export default oddEvenSlice.reducer
