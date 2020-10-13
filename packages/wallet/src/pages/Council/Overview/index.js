import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProposals } from '../../../reducers/rightSlice'
import styled from 'styled-components'
import { Empty } from '../../../components'
import addIcon from '../../../components/addIcon.js'
import checkIcon from '../../../components/checkIcon.js'
import { Table } from 'antd'
// import Proposal from './Proposal/index.js'
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

const columns = [
  {
    title: '成员',
    dataIndex: 'name',
    key: 'name',
    width: '80%',
    render: text => <a>{text}</a>
  },
  {
    title: '备份',
    dataIndex: 'age',
    key: 'age',
    width: '10%'
  },
  {
    title: '投票',
    key: 'action',
    width: '10%'
  }
]

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

const WrapperTable = styled.div`
  background-color: #f00;
  .ant-table-thead {
    .ant-table-cell {
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
    }
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
            <span>{$t('COUNCIL_SEAT')}</span>
            <span className="number">1 / 13</span>
          </div>
          <div>
            <span>{'runners up'}</span>
            <span className="number">1</span>
          </div>
          <div>
            <span>{$t('COUNCIL_CANDIDATE')}</span>
            <span className="number">1</span>
          </div>
        </section>
        <section className="detail"></section>
      </Head>
      <ButtonGroup>
        <Button onClick={() => setAddImageVisible(true)}>
          {checkIcon()}
          {$t('COUNCIL_VOTE')}
        </Button>
        <Button onClick={() => setAddProposalVisible(true)}>
          {addIcon()}
          {$t('COUNCIL_ADD_CANDIDATE')}
        </Button>
      </ButtonGroup>
      <WrapperTable>
        <Table
          columns={columns}
          dataSource={[]}
          className="table-chainx"
          locale={{
            emptyText: (
              <Empty
                text={$t('RIGHT_PROPOSAL_NONE')}
                style={{ marginTop: 30, marginBottom: 30 }}
              />
            )
          }}
        />
      </WrapperTable>
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
