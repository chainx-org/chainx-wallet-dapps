export default {
  Depth: {
    bids: 'Vec<(RpcPrice, RpcBalance)>',
    asks: 'Vec<(RpcPrice, RpcBalance)>'
  },
  RpcOrder: {
    props: 'RpcOrderProperty',
    status: 'OrderStatus',
    remaining: 'RpcBalance',
    executedIndices: 'Vec<TradingHistoryIndex>',
    alreadyFilled: 'RpcBalance',
    lastUpdateAt: 'BlockNumber'
  },
  RpcOrderProperty: {
    id: 'OrderId',
    side: 'Side',
    price: 'RpcPrice',
    amount: 'RpcBalance',
    pairId: 'TradingPairId',
    submitter: 'AccountId',
    orderType: 'OrderType',
    createdAt: 'BlockNumber'
  },
  Page: {
    pageIndex: 'u32',
    pageSize: 'u32',
    data: 'Vec<RpcOrder>'
  }
}
