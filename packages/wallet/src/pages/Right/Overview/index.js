import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProposals } from '../../../reducers/rightSlice'
import styled from 'styled-components'
import addIcon from './addIcon.js'
import Proposal from './Proposal/index.js'
import $t from '../../../locale'
import { Modal } from 'antd'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const selectAfter = (
  <Select defaultValue="pcx" className="select-after">
    <Option value="pcx">PCX</Option>
  </Select>
)

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
  const [addImageVisible, setAddImageVisible] = useState(false)
  const [addProposalVisible, setAddProposalVisible] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    dispatch(fetchProposals()).finally(() => {
      setLoading(false)
    })
  }, [])
  const handleOk = () => {
    console.log('ok click')
  }
  const handleCancelAddImage = () => {
    setAddImageVisible(false)
  }
  const handleCancelAddProposal = () => {
    setAddProposalVisible(false)
  }
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
      </Head>
      <ButtonGroup>
        <Button onClick={() => setAddImageVisible(true)}>
          {addIcon()}
          {$t('RIGHT_ADD_IMAGE')}
        </Button>
        <Button onClick={() => setAddProposalVisible(true)}>
          {addIcon()}
          {$t('RIGHT_ADD_PROPOSAL')}
        </Button>
      </ButtonGroup>
      <Proposal />
      <Modal
        title="Basic Modal"
        visible={addImageVisible}
        okButtonProps={{
          style: {
            backgroundColor: '#f6c94a',
            borderColor: '#f6c94a'
          }
        }}
        width={800}
        onOk={handleOk}
        onCancel={handleCancelAddImage}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="预像哈希"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={$t('RIGHT_ADD_PROPOSAL')}
        visible={addProposalVisible}
        okButtonProps={{
          style: {
            backgroundColor: '#f6c94a',
            borderColor: '#f6c94a'
          }
        }}
        onOk={handleOk}
        onCancel={handleCancelAddProposal}
        width={800}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="预像哈希"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="锁定的余额"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input addonAfter={selectAfter} />
          </Form.Item>
          <Form.Item label="最小押金" name="min" defaultValue={1}>
            <Input addonAfter="PCX" disabled />
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  )
}
