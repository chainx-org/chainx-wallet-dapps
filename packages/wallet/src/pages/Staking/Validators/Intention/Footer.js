import React from 'react'
import validatorEnIcon from './svg/validator.svg'
import validatorZhIcon from './svg/validator_zh.svg'
import trusteeEnIcon from './svg/trustee.svg'
import trusteeZhIcon from './svg/trustee_zh.svg'
import dropoutIcon from './svg/dropout.svg'
import dropoutZhIcon from './svg/drop_out_zh.svg'
import syncNodeEnIcon from './svg/sync_node.svg'
import syncNodeZhIcon from './svg/sync_node_zh.svg'
import senatorIcon from './svg/senator.svg'
import senatorZhIcon from './svg/senator_zh.svg'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

const Footer = styled.footer`
  display: flex;

  & > img:first-of-type {
    z-index: 9;
  }

  & > img:nth-child(2) {
    position: relative;
    left: -7px;
    z-index: 8;
  }

  & > img:nth-child(3) {
    position: relative;
    left: -14px;
    z-index: 7;
  }
`

export default function(props) {
  const locale = useSelector(state => state.settings.locale)

  const { isTrustee = [], isValidating, isChilled, isSenator } = props.intention

  const trusteeIcon = locale === 'zh' ? trusteeZhIcon : trusteeEnIcon
  const validatorIcon = locale === 'zh' ? validatorZhIcon : validatorEnIcon
  const syncNodeIcon = locale === 'zh' ? syncNodeZhIcon : syncNodeEnIcon
  return (
    <Footer>
      {isTrustee.length > 0 ? <img src={trusteeIcon} alt="trustee" /> : null}
      {!isChilled ? (
        <img
          src={isValidating ? validatorIcon : syncNodeIcon}
          alt="validator"
        />
      ) : null}
      {isChilled ? (
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
