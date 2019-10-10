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

export default {
  ...asset,
  ...pseduIntention,
  ...intention,
  ...staking,
  ...footer
}
