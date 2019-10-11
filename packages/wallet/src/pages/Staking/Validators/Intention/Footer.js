import React from 'react'
import validatorIcon from './svg/validator.svg'
import validatorZhIcon from './svg/validator_zh.svg'
import trusteeIcon from './svg/trustee.svg'
import trusteeZhIcon from './svg/trustee_zh.svg'
import dropoutIcon from './svg/dropout.svg'
import dropoutZhIcon from './svg/drop_out_zh.svg'
import syncNodeIcon from './svg/sync_node.svg'
import syncNodeZhIcon from './svg/sync_node_zh.svg'
import senatorIcon from './svg/senator.svg'
import senatorZhIcon from './svg/senator_zh.svg'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

const Footer = styled.footer`
  display: flex;

  & > img:nth-child(2) {
    position: relative;
    left: -7px;
  }

  & > img:nth-child(3) {
    position: relative;
    left: -14px;
  }
`

export default function(props) {
  const locale = useSelector(state => state.settings.locale)

  const { isTrustee, isValidator, isActive, isSenator } = props.intention
  return (
    <Footer>
      {isTrustee.length > 0 ? (
        <img
          src={locale === 'zh' ? trusteeZhIcon : trusteeIcon}
          alt="trustee"
        />
      ) : null}
      <img
        src={
          isValidator
            ? locale === 'zh'
              ? validatorZhIcon
              : validatorIcon
            : locale === 'zh'
            ? syncNodeZhIcon
            : syncNodeIcon
        }
        alt="validator"
      />
      {!isActive ? (
        <img
          src={locale === 'zh' ? dropoutZhIcon : dropoutIcon}
          alt="drop out"
        />
      ) : null}
      {isSenator ? (
        <img src={locale === 'zh' ? senatorZhIcon : senatorIcon} alt="" />
      ) : null}
    </Footer>
  )
}
