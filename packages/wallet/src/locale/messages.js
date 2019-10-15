const asset = {
  ASSET: {
    en: 'Asset',
    zh: '资产'
  },
  ASSET_FREE: {
    en: 'Free',
    zh: '可用余额'
  },
  ASSET_TOTAL: {
    en: 'Total',
    zh: '总余额'
  },
  ASSET_RESERVED_DEX_SPOT: {
    en: 'DEX Reserved',
    zh: '交易冻结'
  },
  ASSET_RESERVED_STAKING: {
    en: 'Staking Reserved',
    zh: '投票冻结'
  },
  ASSET_RESERVED_REVOCATION: {
    en: 'Revocation Reserved',
    zh: '赎回冻结'
  },
  ASSET_RESERVED_WITHDRAWAL: {
    en: 'Withdrawal Reserved',
    zh: '提现冻结'
  },
  ASSET_CHAIN: {
    en: 'Chain',
    zh: '原链'
  },
  LOCK: {
    en: 'Lock',
    zh: '锁仓'
  },
  VIEW: {
    en: 'View',
    zh: '查看'
  },
  WITHDRAW: {
    en: 'Withdraw',
    zh: '提现'
  },
  DEPOSIT: {
    en: 'Deposit',
    zh: '充值'
  },
  TRANSFER: {
    en: 'Transfer',
    zh: '转账'
  },
  MAP: {
    en: 'Map',
    zh: '映射'
  }
}

const pseduIntention = {
  PSEDU_INTENTION: {
    en: 'Mining',
    zh: '跨链挖矿'
  },
  PSEDU_CIRCULATION: {
    en: 'Circulation',
    zh: '全链总余额'
  },
  PSEDU_POWER: {
    en: 'Power',
    zh: '挖矿算力'
  },
  PSEDU_EQUIVALENT: {
    en: 'Equivalent',
    zh: '折合投票数'
  },
  PSEDU_JACKPOT: {
    en: 'Jackpot',
    zh: '奖池金额'
  },
  PSEDU_BALANCE: {
    en: 'Balance',
    zh: '我的总余额'
  }
}

const intention = {
  INTENTION_VALIDATOR: {
    zh: '验证节点',
    en: 'Validator'
  },
  INTENTION_TRUSTEE: {
    zh: '信托',
    en: 'Trustee'
  }
}

const staking = {
  STAKING: {
    en: 'Staking',
    zh: '投票选举'
  },
  STAKING_TOTAL_NOMINATION: {
    en: 'Nomination',
    zh: '总得票'
  },
  STAKING_SELF_VOTE: {
    en: 'Self Vote',
    zh: '自抵押'
  },
  STAKING_VOTE: {
    en: 'Vote',
    zh: '投票'
  }
}

const trust = {
  TRUST: {
    en: 'Trust',
    zh: '资产信托'
  }
}

const footer = {
  FOOTER_BLOCK_TIME: {
    en: 'Block time',
    zh: '出块时间'
  },
  FOOTER_BLOCK_NUMBER: {
    en: 'Block number',
    zh: '最新高度'
  }
}

const header = {
  HEADER_DEMO_ACCOUNT: {
    en: 'Demo Account',
    zh: '体验账户'
  }
}

export default {
  ...asset,
  ...pseduIntention,
  ...intention,
  ...staking,
  ...footer,
  ...trust,
  ...header
}
