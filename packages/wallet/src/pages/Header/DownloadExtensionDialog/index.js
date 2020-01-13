import React from 'react'
import StyledDialog from '../DownloadSignerDialog/Wrapper'
import $t from '../../../locale'
import { DefaultButton, PrimaryButton } from '@chainx/ui'

const extensionReleasesPageUrl =
  'https://chrome.google.com/webstore/detail/chainx-extension/dffjlgnecfafjfmkknpipapcbgajflge'

export default function({ handleClose }) {
  return (
    <StyledDialog
      open
      handleClose={handleClose}
      title={$t('HEADER_DOWNLOAD_SIGNER_TITLE')}
    >
      <div className="wrapper">
        <p>{$t('HEADER_DOWNLOAD_EXTENSION_DETAIL')}</p>
        <div className="buttons">
          <PrimaryButton
            size="medium"
            onClick={() => {
              window.open(extensionReleasesPageUrl)
            }}
          >
            {$t('HEADER_GO_TO_STORE')}
          </PrimaryButton>
          <DefaultButton size="medium" onClick={handleClose}>
            {$t('COMMON_CANCEL')}
          </DefaultButton>
        </div>
      </div>
    </StyledDialog>
  )
}
