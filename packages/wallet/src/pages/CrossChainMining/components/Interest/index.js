import styled from 'styled-components'
import { toPrecision } from '../../../../utils'
import { PrimaryButton } from '@chainx/ui'
import React, { useState } from 'react'
import warningIcon from './warning.svg'
import Condition from './Condition'
import $t from '../../../../locale'

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  position: relative;
  label {
    opacity: 0.32;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.2px;
    line-height: 16px;
    margin-right: 8px;
  }
  & > span {
    display: inline-flex;
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 24px;
    min-width: 200px;
    & > span {
      display: inline-flex;
      align-items: center;
    }
    img {
      margin-left: 6px;
      width: 16px;
    }
    span.interest {
      opacity: 0.72;
    }
  }

  button {
    width: 84px;
    span {
      width: 84px !important;
      font-size: 14px !important;
    }
  }
`

export default function(props) {
  const { interest, precision, claim, token, disabled, claimInfo = {} } = props
  const { canClaim } = claimInfo
  const [openCondition, setOpenCondition] = useState(false)

  return (
    <Wrapper>
      <label>{$t('PSEDU_INTEREST')}</label>
      <span>
        <span className="interest">{toPrecision(interest, precision)} PCX</span>
        {interest > 0 && !canClaim ? (
          <span onMouseEnter={() => setOpenCondition(true)}>
            <img src={warningIcon} alt="interest" />
          </span>
        ) : null}
      </span>
      <PrimaryButton
        disabled={!canClaim || disabled}
        size="small"
        onClick={() => claim(token)}
      >
        {$t('PSEDU_CLAIM')}
      </PrimaryButton>
      {interest > 0 && openCondition ? (
        <Condition
          claimInfo={claimInfo}
          close={() => setOpenCondition(false)}
        />
      ) : null}
    </Wrapper>
  )
}
