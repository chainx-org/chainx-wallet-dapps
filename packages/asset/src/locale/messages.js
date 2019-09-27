const asset = {
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

export default {
  ...asset,
  ...intention
}
