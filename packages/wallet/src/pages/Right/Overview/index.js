import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProposals } from '../../../reducers/rightSlice'
import styled from 'styled-components'
import addIcon from './addIcon.js'
import Proposal from './Proposal/index.js'
import $t from '../../../locale'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Head = styled.div`
    display: flex;
    padding: 16px 32px;
    height: 80px;
    align-items: stretch;
    justify-content: space-between;
    .detail {
      display: flex;
      justify-content: space-between;
      div {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        span {
          margin: 0 10px;
          color: rgba(78, 78, 78, 0.66);
        }
        .number{
          font-size: 24px;
        }
      }
    }
  }
`
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 32px;
  margin: 10px 0;
`

export const Button = styled.button`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 4px;
  border: none;
  background: #fff;
  margin-left: 10px;
  svg {
    width: 28px;
    height: 28px;
    padding: 7px;
    box-sizing: border-box;
    fill: #ffffff;
    margin-right: 5px;
    background-color: #f6c94a;
    border-radius: 50%;
  }
  &:hover {
    background-color: #f6c94a;
    color: rgba(255, 253, 251, 0.875);
    text-shadow: none;
    border: 1px;
    border-color: #f6c94a;
    svg {
      fill: #ffffff;
    }
  }
  &:focus {
    outline: none;
    border: none;
  }
`

export default function() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    dispatch(fetchProposals()).finally(() => {
      setLoading(false)
    })
  }, [])
  return (
    <Wrapper>
      <Head>
        <section className="detail">
          <div>
            <span>{$t('RIGHT_PROPOSAL')}</span>
            <span className="number">1</span>
          </div>
          <div>
            <span>{$t('RIGHT_TOTAL')}</span>
            <span className="number">1</span>
          </div>
        </section>
        <section className="detail">
          <div>
            <span>{$t('RIGHT_REFERENCE')}</span>
            <span className="number">1</span>
          </div>
          <div>
            <span>{$t('RIGHT_TOTAL')}</span>
            <span className="number">1</span>
          </div>
        </section>
        {/* <section className="detail" >
          <div>
            <span>启动期</span>
            <span>28天</span>
            <span>7天7小时</span>
          </div>
          <div>
            chart
          </div>
        </section> */}
      </Head>
      <ButtonGroup>
        <Button>
          {addIcon()}
          提交原像
        </Button>
        <Button>
          {addIcon()}
          提交议案
        </Button>
      </ButtonGroup>
      <Proposal />
    </Wrapper>
  )
}
