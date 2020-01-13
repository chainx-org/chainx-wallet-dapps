import trade from './trade'
import chain from './chain'
import staking from './staking'
import asset from './asset'
import trust from './trust'
import pseduIntention from './pseduIntention'
import notification from './notification'
import txs from './txs'

const common = {
  COMMON_FEE: {
    en: 'Fee',
    zh: '手续费'
  },
  COMMON_MEMO_SHORT: {
    en: 'Memo',
    zh: '备注'
  },
  COMMON_CANCEL: {
    en: 'Cancel',
    zh: '取消'
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
  },
  HEADER_CONNECT_SIGNER: {
    en: 'Connect ChainX Signer',
    zh: '连接 ChainX 本地签名器'
  },
  HEADER_CONNECT_EXTENSION: {
    en: 'Connect ChainX extension',
    zh: '连接 ChainX 插件'
  },
  HEADER_DOWNLOAD_SIGNER_TITLE: {
    en: 'Download ChainX Signer',
    zh: '下载 ChainX Signer'
  },
  HEADER_DOWNLOAD_EXTENSION_TITLE: {
    en: 'Install ChiainX extension',
    zh: '安装ChainX插件'
  },
  HEADER_DOWNLOAD_SIGNER_DETAIL: {
    en: 'Please refresh this page after download the ChainX Signer.',
    zh: '下载 ChainX Signer，安装完成后请手动刷新钱包页面。'
  },
  HEADER_DOWNLOAD_EXTENSION_DETAIL: {
    en: 'Install ChainX extension from chrome extension store.',
    zh: '在 Google 商店内搜索并安装 ChainX 插件，安装完成后请手动刷新钱包页面。'
  },
  HEADER_GO_TO_DOWNLOAD: {
    en: 'Download page',
    zh: '去下载'
  },
  HEADER_GO_TO_STORE: {
    en: 'Extension store',
    zh: '去商店'
  },
  HEADER_MSG_NO_SIGNER_ACCOUNT_TITLE: {
    en: 'No Signer account',
    zh: 'Signer无账户'
  },
  HEADER_MSG_NO_SIGNER_ACCOUNT_DETAIL: {
    en: 'Please add account in ChainX Signer',
    zh: '请在ChainX Signer中创建账户'
  },
  HEADER_MSG_SIGNER_LINK_FAIL_TITLE: {
    en: 'Fail to connect signer',
    zh: '连接ChainX Signer失败'
  },
  HEADER_MSG_SIGNER_LINK_FAIL_DETAIL: {
    en: 'Please retry after install and open ChainX Signer',
    zh: '请下载安装或打开ChainX Signer后重试'
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
  ...notification,
  ...txs
}
