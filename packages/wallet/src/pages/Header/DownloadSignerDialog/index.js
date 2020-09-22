import React from 'react'
import StyledDialog from './Wrapper'
import $t from '../../../locale'
import Download from './Download'
import { useSelector } from 'react-redux'
import { localeSelector } from '../../../reducers/settingsSlice'

const signerReleasesPageUrl =
  'https://github.com/wliyongfeng/chainx2-signer/releases'

export default function({ handleClose }) {
  const locale = useSelector(localeSelector)

  return (
    <StyledDialog
      open
      handleClose={handleClose}
      title={$t('HEADER_DOWNLOAD_SIGNER_TITLE')}
    >
      <div className="wrapper">
        <p>{$t('HEADER_DOWNLOAD_SIGNER_DETAIL')}</p>
        <Download />
        {locale === 'zh' ? (
          <p>
            您也可以通过其它方式获取签名器，如在{' '}
            <a
              href={signerReleasesPageUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              github
            </a>{' '}
            上下载
          </p>
        ) : (
          <p>
            You can also download from{' '}
            <a
              href={signerReleasesPageUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              github
            </a>
            .
          </p>
        )}
      </div>
    </StyledDialog>
  )
}
