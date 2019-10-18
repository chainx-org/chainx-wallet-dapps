import React from 'react'

import { Dialog, PrimaryButton } from '@chainx/ui'
import styled from 'styled-components'
import $t from '../locale'

const StyledDialog = styled(Dialog)`
  main.content {
    padding: 0 16px 20px;
  }
`

export default function({ open, info, switch: switchOpen, extrinsic }) {
  console.log('to sign extrinsic:', extrinsic)

  return (
    <StyledDialog
      open={open}
      handleClose={() => switchOpen(false)}
      title="Sign"
    >
      <main className="content">
        <div className="info">{info}</div>

        <div style={{ marginTop: 16 }}>
          <PrimaryButton size="fullWidth" onClick={() => console.log('sign')}>
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </main>
    </StyledDialog>
  )
}
