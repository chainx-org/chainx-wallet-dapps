import React from 'react'
import StyledDialog from '../DownloadSignerDialog/Wrapper'
import $t from '../../../locale'
import { DefaultButton, PrimaryButton } from '@chainx/ui'

const chromeExtensionReleasesPageUrl =
  'https://chrome.google.com/webstore/detail/chainx-extension/dffjlgnecfafjfmkknpipapcbgajflge'
const edgeExtensionReleasesPageUrl =
  'https://microsoftedge.microsoft.com/addons/detail/pglmaogdhpmengmblgdjgnnabbafegkk'

export default function({ handleClose }) {
  const isEdge = /Edg/.test(window.navigator.userAgent)

  return (
    <StyledDialog
      open
      handleClose={handleClose}
      title={$t('HEADER_DOWNLOAD_EXTENSION_TITLE')}
    >
      <div className="wrapper">
        <p>{$t('HEADER_DOWNLOAD_EXTENSION_DETAIL')}</p>
        <div className="buttons">
          <PrimaryButton
            size="medium"
            onClick={() => {
              window.open(
                isEdge
                  ? edgeExtensionReleasesPageUrl
                  : chromeExtensionReleasesPageUrl
              )
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
