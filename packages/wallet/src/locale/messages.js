import trade from './trade'
import chain from './chain'
import staking from './staking'
import asset from './asset'
import trust from './trust'
import pseduIntention from './pseduIntention'
import notification from './notification'
import txs from './txs'
import common from './common'

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
    zh:
      '在 {browser} 商店内搜索并安装 ChainX 插件，安装完成后请手动刷新钱包页面。'
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
    en: 'No account in ChainX Signer and switch to demo account',
    zh: 'ChainX Signer中无账户，自动切换为体验账户'
  },
  HEADER_MSG_NO_EXTENSION_ACCOUNT_TITLE: {
    en: 'No extension account',
    zh: '插件无账户'
  },
  HEADER_MSG_NO_EXTENSION_ACCOUNT_DETAIL: {
    en: 'No account in ChainX extension',
    zh: 'ChainX 插件中无账户，请创建或导入账户'
  },
  HEADER_MSG_NODE_INVALID_TITLE: {
    en: 'Node protocol invalid',
    zh: '节点协议非法'
  },
  HEADER_MSG_NODE_INVALID_DETAIL: {
    en: 'Please use node with url starts with wss://',
    zh: '请使用安全的节点连接（以wss://开头）'
  },
  HEADER_MSG_SIGNER_LINK_FAIL_TITLE: {
    en: 'Fail to connect signer',
    zh: '连接ChainX Signer失败'
  },
  HEADER_MSG_SIGNER_LINK_FAIL_DETAIL: {
    en: 'Please retry after install and open ChainX Signer',
    zh: '请下载安装或打开ChainX Signer后重试'
  },
  HEADER_MSG_SIGNER_LINK_TIMEOUT: {
    en: 'Connect to signer timeout',
    zh: '连接超时'
  },
  HEADER_SIGNER_DISCONNECT_TITLE: {
    en: 'ChainX signer disconnectd',
    zh: 'ChainX signer断开连接'
  },
  HEADER_SIGNER_DISCONNECT_DETAIL: {
    en: 'ChainX signer disconnectd. Please open it and refresh the page.',
    zh: 'ChainX signer断开连接，请打开signer后刷新页面。'
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
