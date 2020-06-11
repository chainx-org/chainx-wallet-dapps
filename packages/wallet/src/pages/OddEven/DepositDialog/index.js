import React from 'react'
import { P1, P2, P3, StyledDialog, Wrapper } from './styledComponents'
import $t from '../../../locale'
import { oddEvenDepositAddress } from '../../../utils/constants'

export default function({ handleClose }) {
  return (
    <StyledDialog title={$t('WITHDRAW')} open handleClose={handleClose}>
      <Wrapper>
        <P1>
          请切换到<b>主网</b>向<b>主网地址</b>转账
        </P1>
        <P2>{oddEvenDepositAddress}</P2>
        <P3>
          并在备注中输入你的<b>测试网地址</b>
        </P3>
      </Wrapper>
    </StyledDialog>
  )
}
