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
      <span>{$t('COMMON_NEW_DAPP')}</span>
      <a href="https://dapp-v2.chainx.org/#/accounts">{$t('COMMON_CLICK')}</a>
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
