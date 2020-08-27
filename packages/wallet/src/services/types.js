export default {
  FullPairInfo: {
    profile: 'TradingPairProfile',
    handicap: 'RpcHandicap',
    pairInfo: 'RpcTradingPairInfo',
    maxValidBid: 'RpcPrice',
    minValidAsk: 'RpcPrice'
  },
  RpcTradingPairInfo: {
    latestPrice: 'RpcPrice',
    lastUpdated: 'BlockNumber'
  },
  RpcHandicap: {
    highestBid: 'RpcPrice',
    lowestAsk: 'RpcPrice'
  }
}
