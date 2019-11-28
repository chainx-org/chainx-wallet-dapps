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
  ASSET_TRANSFER_IN: {
    en: 'In',
    zh: '转入'
  },
  ASSET_TRANSFER_OUT: {
    en: 'Out',
    zh: '转出'
  },
  ASSET_TRANSFER_AMOUNT: {
    en: 'Transfer amount',
    zh: '转账数量'
  },
  ASSET_BALANCE: {
    en: 'Balance:',
    zh: '余额：'
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
  },
  ASSET_TRANSFER_ADDR_ERROR: {
    en: 'Invalid address',
    zh: '地址错误'
  },
  ASSET_TRANSFER_AMOUNT_ERROR: {
    en: 'Invalid amount',
    zh: '金额错误'
  },
  ASSET_TRANSFER_AMOUNT_TOO_MUCH_ERROR: {
    en: 'Overflow the balance',
    zh: '超出可用余额'
  },
  ASSET_TRANSFER_RECORD: {
    en: 'Transfers',
    zh: '转账记录'
  },
  ASSET_CROSS_CHAIN_RECORD: {
    en: 'Cross chain',
    zh: '跨链记录'
  },
  ASSET_CROSS_CHAIN_DEPOSIT: {
    en: 'Deposit',
    zh: '充值'
  },
  ASSET_CROSS_CHAIN_WITHDRAWAL: {
    en: 'Withdrawal',
    zh: '提现'
  },
  ASSET_CROSS_CHAIN_LOCK: {
    en: 'Lock',
    zh: '锁仓'
  },
  ASSET_CONTACT: {
    en: 'Contact',
    zh: '联系地址'
  },
  ASSET_CONVERT: {
    en: 'Convert',
    zh: '划转'
  },
  ASSET_WITHDRAWAL_AMOUNT: {
    en: 'Withdrawal amount',
    zh: '提现数量'
  },
  ASSET_WITHDRAWAL_AMOUNT_CANCEL: {
    en: 'Canceled',
    zh: '已取消'
  },
  ASSET_WITHDRAWAL_AMOUNT_APPLYING: {
    en: 'Applying',
    zh: '申请中'
  },
  ASSET_WITHDRAWAL_AMOUNT_CONFIRMED: {
    en: 'Confirmed',
    zh: '已确认'
  },
  ASSET_WITHDRAWAL_AMOUNT_SIGNING: {
    en: 'Signing',
    zh: '签名中'
  },
  ASSET_WITHDRAWAL_TX_ID: {
    en: 'Tx ID',
    zh: '交易ID'
  },
  ASSET_ORIGIN_TX_ID: {
    en: 'Btc tx ID',
    zh: '原链交易 ID'
  },
  ASSET_DEPOSIT_CONFIRMED: {
    en: 'Confirmed',
    zh: '已确认'
  }
}

const common = {
  COMMON_FEE: {
    en: 'Fee',
    zh: '手续费'
  },
  COMMON_MEMO_SHORT: {
    en: 'Memo',
    zh: '备注'
  },
  COMMON_CONFIRM: {
    en: 'OK',
    zh: '确定'
  },
  COMMON_MEMO: {
    en: 'Memo(64 characters at most)',
    zh: '备注（64 字符以内）'
  },
  COMMON_ASSET_TOO_LOW_ERROR: {
    en: 'Balance too low',
    zh: '金额过低'
  },
  COMMON_TOO_LONG: {
    en: 'Too long',
    zh: '长度超过限制'
  },
  COMMON_TOO_SHORT: {
    en: 'Too short',
    zh: '长度小于最小值'
  },
  COMMON_INVALID_FORMAT: {
    en: 'Invalid format',
    zh: '格式错误'
  },
  COMMON_JACKPOT: {
    en: 'Jackpot',
    zh: '奖池金额'
  },
  COMMON_UNFREEZE: {
    en: 'unfreeze',
    zh: '解冻'
  },
  COMMON_ADDRESS: {
    en: 'Address',
    zh: '地址'
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
  },
  PSEDU_CLAIM: {
    en: 'Claim',
    zh: '提息'
  },
  PSEDU_INTEREST: {
    en: 'Interest',
    zh: '利息'
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
  },
  STAKING_CLAIM: {
    en: 'Claim',
    zh: '提息'
  },
  STAKING_SWITCH_NOMINATION: {
    en: 'Switch nomination',
    zh: '切换投票'
  },
  STAKING_UN_NOMINATION: {
    en: 'Redeem nomination',
    zh: '赎回投票'
  },
  STAKING_VOTE_AMOUNT: {
    en: 'Vote amount',
    zh: '投票数量'
  },
  STAKING_ACCOUNT_ADDRESS: {
    en: 'Account address',
    zh: '账户地址'
  },
  STAKING_SELF_VOTE_NUMBER: {
    en: 'Self Vote',
    zh: '自抵押数'
  },
  STAKING_JACKPOT_AMOUNT: {
    en: 'Jackpot amount',
    zh: '奖池金额'
  },
  STAKING_JACKPOT_ADDR: {
    en: 'Jackpot address',
    zh: '奖池地址'
  },
  STAKING_NOMINATION_NUMBER: {
    en: 'Nomination',
    zh: '总得票数'
  },
  STAKING_CHECK_DROP_OUT: {
    en: 'View drop out intentions',
    zh: '查看退选节点'
  },
  STAKING_REGISTER_INTENTION: {
    en: 'Register Intention',
    zh: '注册节点'
  },
  STAKING_UPDATE_INTENTION: {
    en: 'Update Intention',
    zh: '更新节点'
  },
  STAKING_NOMINATION_RATE: {
    en: 'Nomination Rate',
    zh: '投票率'
  },
  STAKING_ALL_NOMINATION: {
    en: 'All Nomination',
    zh: '投票总数'
  },
  STAKING_MY_NOMINATION: {
    en: 'My nomination',
    zh: '我的投票'
  },
  STAKING_INTEREST: {
    en: 'Interest',
    zh: '待领利息'
  },
  STAKING_NOW_NOMINATION: {
    en: 'Now nomination',
    zh: '当前票数'
  },
  STAKING_AFTER_NOMINATION: {
    en: 'Nomination after operation',
    zh: '修改后票数'
  }
}

const trust = {
  TRUST: {
    en: 'Trust',
    zh: '资产信托'
  }
}

const contract = {
  CONTRACTINDEX: {
    en: 'Contract',
    zh: '智能合约'
  },
  CONTRACT: {
    en: 'Contract',
    zh: '合约'
  },
  CODE: {
    en: 'Contract Code',
    zh: '上传合约'
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
  },
  HEADER_GET_EXTENSION: {
    en: 'Get ChainX Extension',
    zh: '获取ChainX插件'
  }
}

export default {
  ...asset,
  ...pseduIntention,
  ...intention,
  ...staking,
  ...footer,
  ...trust,
  ...header,
  ...common,
  ...contract
}
