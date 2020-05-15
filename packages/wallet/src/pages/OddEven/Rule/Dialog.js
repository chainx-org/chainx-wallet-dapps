import React from 'react'
import styled from 'styled-components'
import { Dialog } from '@chainx/ui'
import $t from '../../../locale'

export const StyledDialog = styled(Dialog)`
  div.wrapper {
    padding: 16px;

    ol,
    li {
      margin: 0;
      padding: 0;
    }
    li {
      opacity: 0.56;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;
      &:not(:first-of-type) {
        margin-top: 5px;
      }
    }
  }
`

export default function({ handleClose }) {
  return (
    <StyledDialog title={$t('PREDICT_RULE')} open handleClose={handleClose}>
      <div className="wrapper">
        <ol>
          <li>* 游戏开始：设定要待预测的比特币区块高度，开始新一轮游戏；</li>
          <li>
            * 用户投注：用户预测该高度的比特币区块哈希的奇偶，投入预测金额；
          </li>
          <li>* 游戏结束：在比特币到达该预测区块的前20个区块，停止投注；</li>
          <li>
            *
            奖励分发：游戏达到指定区块，根据该比特币高度区块奇偶，预测胜利的一方按投注金额占比瓜分所有投注金额，失败的一方不进行返还。
          </li>
        </ol>
      </div>
    </StyledDialog>
  )
}
