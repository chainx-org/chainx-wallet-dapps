import React from 'react'
import { Alert } from 'antd'
import 'antd/dist/antd.css'
import styled from 'styled-components'
import $t from '../../locale'

const Wrapper = styled.div`
  margin-bottom: 10px;
`

function Warning() {
  const url = (
    <div>
      <span>{$t('ASSET_NEW_DAPP1')}</span>
      <a href="https://dapp-v2.chainx.org/#/accounts">
        {$t('ASSET_CLICK_THIS')}
      </a>
      <span>{$t('ASSET_NEW_DAPP2')}</span>
      <a href="https://mp.weixin.qq.com/s/rTzelAmg_jzTHu0LKacswg">
        https://mp.weixin.qq.com/s/rTzelAmg_jzTHu0LKacswg
      </a>
    </div>
  )
  return (
    <Wrapper>
      <Alert
        message="Warning"
        description={url}
        type="error"
        showIcon
        closable
        banner
        onClose={() => (window.location.href = 'https://dapp-v2.chainx.org/')}
      />
    </Wrapper>
  )
}

export default Warning
