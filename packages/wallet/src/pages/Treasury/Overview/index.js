import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProposals } from '../../../reducers/rightSlice'
import styled from 'styled-components'
import { Empty } from '../../../components'
import addIcon from '../../../components/addIcon.js'
import { Table } from 'antd'
// import Proposal from './Proposal/index.js'
import $t from '../../../locale'
import { Modal } from 'antd'
import { Form, Input, Select } from 'antd'
import {
  WrapperTable,
  Button,
  ButtonGroup,
  Head
} from '../../Council/Overview/index'

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

const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
`
export default function() {
  const [loading, setLoading] = useState(false)
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
  const handleCancelAddProposal = () => {
    setAddProposalVisible(false)
  }
  const columns = [
    {
      title: $t('RIGHT_PROPOSAL'),
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      render: text => <a>{text}</a>
    },
    {
      title: '受益者',
      dataIndex: 'age',
      key: 'age',
      width: '20%'
    },
    {
      title: '支付款',
      key: 'action',
      width: '10%'
    },
    {
      title: '抵押',
      key: 'action',
      width: '10%'
    },
    {
      title: '',
      key: 'action',
      width: '10%'
    }
  ]
  const columnsAgree = [
    {
      title: $t('TREASURY_AGREE'),
      dataIndex: 'name',
      key: 'name',
      width: '80%',
      render: text => <a>{text}</a>
    }
  ]
  return (
    <WrapperContent>
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
            <span>{$t('TREASURY_AGREE')}</span>
            <span className="number">1</span>
          </div>
        </section>
        <section className="detail">
          <div>
            <span>{$t('TREASURY_USEABLE')}</span>
            <span className="number">1</span>
          </div>
          <div>
            <span>{$t('TREASURY_DESTORY')}</span>
            <span className="number">1</span>
          </div>
        </section>
      </Head>
      <ButtonGroup>
        <Button onClick={() => setAddProposalVisible(true)}>
          {addIcon()}
          {$t('RIGHT_ADD_PROPOSAL')}
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
      <WrapperTable>
        <Table
          columns={columnsAgree}
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
    </WrapperContent>
  )
}
