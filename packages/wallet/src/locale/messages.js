import trade from './trade'
import chain from './chain'
import staking from './staking'
import asset from './asset'
import trust from './trust'
import pseduIntention from './pseduIntention'
import notification from './notification'

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
  },
  COMMON_SIGN_TX_BUSY: {
    en: 'Sign transaction busy',
    zh: '插件存在尚未处理的签名请求'
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
  },
  HEADER_TXS: {
    en: 'History transactions',
    zh: '交易记录'
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
  ...contract,
  ...trade,
  ...chain,
  ...notification
}
