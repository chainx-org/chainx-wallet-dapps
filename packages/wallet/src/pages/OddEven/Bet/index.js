import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { setOpenBetBtcDialog } from '../../../reducers/runStatusSlice'
import $t from '../../../locale'

const Btn = styled.button`
  font-weight: 600;
  font-size: 20px;
  color: #ffffff;
  letter-spacing: 0.2px;
  text-align: center;
  line-height: 32px;
  width: 200px;
  height: 80px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const Odd = styled(Btn)`
  background-image: linear-gradient(180deg, #f17800 0%, #e05300 100%);
  border-radius: 40px 0 0 40px;
`
const Even = styled(Btn)`
  background-image: linear-gradient(180deg, #00a7f0 0%, #0086dc 100%);
  border-radius: 0 100px 100px 0;
  margin-left: 4px;
`

const Wrapper = styled.section`
  position: relative;

  span {
    display: inline-flex;
    justify-content: space-around;
    align-items: center;

    background: #ffffff;
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    left: calc(50% - 25px);
    top: calc(50% - 25px);
    font-weight: 600;
    font-size: 14px;
    color: #af946f;
    letter-spacing: 0.1px;
    line-height: 20px;
  }
`

export default function() {
  const dispatch = useDispatch()

  const bet = betOdd => {
    dispatch(
      setOpenBetBtcDialog({
        open: true,
        betOdd
      })
    )
  }

  return (
    <Wrapper>
      <Odd onClick={() => bet(true)}>{$t('PREDICT_ODD')}</Odd>
      <Even onClick={() => bet(false)}>{$t('PREDICT_EVEN')}</Even>
      <span>{$t('PREDICT_BET')}</span>
    </Wrapper>
  )
}
