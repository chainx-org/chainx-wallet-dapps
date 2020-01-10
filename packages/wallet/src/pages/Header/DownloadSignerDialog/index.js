import React from 'react'
import StyledDialog from './Wrapper'
import $t from '../../../locale'
import { DefaultButton, PrimaryButton } from '@chainx/ui'

const signerReleasesPageUrl =
  'https://github.com/chainx-org/chainx-signer/releases'

export default function({ handleClose }) {
  return (
    <StyledDialog
      open
      handleClose={handleClose}
      title={$t('HEADER_DOWNLOAD_SIGNER_TITLE')}
    >
      <div className="wrapper">
        <p>{$t('HEADER_DOWNLOAD_SIGNER_DETAIL')}</p>
        <div className="buttons">
          <PrimaryButton
            size="medium"
            onClick={() => {
              window.open(signerReleasesPageUrl)
            }}
          >
            {$t('HEADER_GO_TO_DOWNLOAD')}
          </PrimaryButton>
          <DefaultButton size="medium" onClick={handleClose}>
            {$t('COMMON_CANCEL')}
          </DefaultButton>
        </div>
      </div>
    </StyledDialog>
  )
}
