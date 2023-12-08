import { useEffect, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { BillType, UserType, GroupType } from '@/type/es'
import {
  Button,
  Card,
  Spin,
  Table,
  Statistic,
  Col,
  Row,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
} from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'
import { categoryList } from '@/data/category'

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
)

export default function Dashboard() {
  const current = Bmob.User.current() as any
  const [form] = Form.useForm()
  const [settleUpForm] = Form.useForm()
  const [isBillLoading, setIsBillLoading] = useState(false)
  const [isNewBillModalVisible, setIsNewBillModalVisible] = useState(false)
  const [isSettleModalVisible, setIsSettleModalVisible] = useState(false)
  const [groupData, setGroupData] = useState<GroupType[]>([])
  const [userBillData, setUserBillData] = useState<BillType[]>([])
  const [memberData, setMemberData] = useState<UserType[]>([])
  const existingMembers = memberData.map((member) => ({
    label: member.username,
    value: member.objectId,
  }))

  const existingGroups = groupData.map((group) => ({
    label: group.name,
    value: group.objectId,
  }))

  const pendingBills = userBillData
    .filter((bill) => bill.status === 'pending')
    .map((bill) => ({
      label: bill.name,
      value: bill.objectId,
    }))

  const { Search } = Input

  const fetchCurrentUserBillData = () => {
    // fetch bill data by the current user as the owner
    const billQuery = Bmob.Query('Bill')
    setIsBillLoading(true)
    billQuery.equalTo('owner', '==', current.objectId)
    billQuery
      .find()
      .then((res: any) => {
        setIsBillLoading(false)
        const formattedBillData = (res as BillType[]).map((bill: BillType) => ({
          objectId: bill.objectId,
          name: bill.name,
          currency: bill.currency,
          payers: bill.payers,
          category: bill.category,
          description: bill.description,
          owner: bill.owner,
          group: bill.group,
          price: bill.price,
          status: bill.status,
          createAt: bill.createAt,
          updateAt: bill.updateAt,
          completeAt: bill.completeAt,
        }))
        setUserBillData(formattedBillData)
      })
      .catch((err) => {
        setIsBillLoading(false)
        console.log(err)
      })
  }

  const fetchGroupData = () => {
    const groupQuery = Bmob.Query('Group')
    groupQuery
      .find()
      .then((res: any) => {
        const formattedGroupData = (res as GroupType[]).map(
          (group: GroupType) => ({
            objectId: group.objectId,
            name: group.name,
            description: group.description,
            owner: group.owner,
            members: group.members,
            bills: group.bills,
            createAt: group.createAt,
            updateAt: group.updateAt,
          }),
        )
        setGroupData(formattedGroupData)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const fetchMemberData = () => {
    // fetch member data
    const memberQuery = Bmob.Query('_User')
    memberQuery
      .find()
      .then((res: any) => {
        const formattedMemberData = (res as UserType[]).map(
          (member: UserType) => ({
            objectId: member.objectId,
            username: member.username,
            email: member.email,
            phone: member.phone,
            createAt: member.createAt,
            updateAt: member.updateAt,
          }),
        )
        setMemberData(formattedMemberData)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    // fetch bill data by the current user as the owner
    fetchCurrentUserBillData()
    // fetch member data
    fetchMemberData()
    // fetch group data by the current user as the owner
    fetchGroupData()
  }, [])

  const onSearch = (value: string) => console.log(value)
  const handleCreateBillOk = () => {
    form.submit()
  }

  const handleCreateBillCancel = () => {
    setIsNewBillModalVisible(false)
  }

  const handleAddBill = () => {
    setIsNewBillModalVisible(true)
  }

  const handleSettleUpOk = () => {
    settleUpForm.submit()
  }

  const handleSettleUpCancel = () => {
    setIsSettleModalVisible(false)
  }

  const handleBillSettle = () => {
    setIsSettleModalVisible(true)
  }

  // update the bill status
  const onBillSettleUp = (values: any) => {
    const billQuery = Bmob.Query('Bill')
    billQuery.set('id', values.bill)
    billQuery.set('status', values.status)
    billQuery
      .save()
      .then((res: any) => {
        message.success('Bill settled up successfully! at ' + res.updatedAt)
        fetchCurrentUserBillData()
        setIsSettleModalVisible(false)
      })
      .catch((err) => {
        message.error('Bill settled up failed! ' + err.message)
        console.log(err)
        setIsSettleModalVisible(false)
      })
  }

  const onBillFormFinish = (values: any) => {
    setIsNewBillModalVisible(false)
    // create bill
    const bill = Bmob.Query('Bill')
    const userPointer = Bmob.Pointer('_User')
    const userPoiID = userPointer.set(current.objectId) as unknown as string

    const groupPointer = Bmob.Pointer('_User')
    const groupPoiID = groupPointer.set(values.group) as unknown as string

    const relation = Bmob.Relation('_User')
    const memberIDx = relation.add(values.payers) as unknown as string

    bill.set('name', values.name)
    bill.set('description', values.description)
    bill.set('owner', userPoiID)
    bill.set('group', groupPoiID)
    bill.set('price', values.price)
    bill.set('currency', values.currency)
    bill.set('status', 'pending')
    bill.set('payers', memberIDx)
    bill
      .save()
      .then((res: any) => {
        message.success('Bill created successfully! at ' + res.createdAt)
        fetchCurrentUserBillData()
      })
      .catch((err) => {
        message.error('Bill created failed! ' + err.message)
        console.log(err)
      })
  }

  return (
    <PageContainer>
      <Modal
        title='Settle up'
        open={isSettleModalVisible}
        onOk={handleSettleUpOk}
        onCancel={handleSettleUpCancel}
      >
        <Form
          form={settleUpForm}
          name='basicForm'
          initialValues={{ remember: true }}
          onFinish={onBillSettleUp}
          autoComplete='off'
        >
          {/* Add an iterm to select the bill owner */}
          <Form.Item
            label='Select a bill'
            name='bill'
            rules={[
              {
                required: true,
                message: 'Please select a bill!',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder='Please select'
              options={pendingBills}
            />
          </Form.Item>
          {/* select the status you want set for the bill */}
          <Form.Item
            label='Status'
            name='status'
            rules={[
              {
                required: true,
                message: 'Please select a status!',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder='Please select'
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Completed', value: 'completed' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title='Create a new bill'
        open={isNewBillModalVisible}
        onOk={handleCreateBillOk}
        onCancel={handleCreateBillCancel}
      >
        <Form
          form={form}
          name='basicForm'
          initialValues={{ remember: true }}
          onFinish={onBillFormFinish}
          autoComplete='off'
        >
          <Form.Item
            label='Bill Name'
            name='name'
            rules={[
              {
                required: true,
                message: 'Please input your name of the bill!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* add item for price in number */}
          <Form.Item
            label='Price'
            name='price'
            rules={[
              {
                required: true,
                message: 'Please input your price of the bill!',
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          {/* Add item to select the currency */}
          <Form.Item
            label='Currency'
            name='currency'
            rules={[
              {
                required: true,
                message: 'Please select a currency!',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder='Please select'
              options={[
                { label: 'USD', value: 'USD' },
                { label: 'CNY', value: 'CNY' },
                { label: 'JPY', value: 'JPY' },
                { label: 'EUR', value: 'EUR' },
                { label: 'GBP', value: 'GBP' },
                { label: 'KRW', value: 'KRW' },
                { label: 'SGD', value: 'SGD' },
                { label: 'CAD', value: 'CAD' },
                { label: 'AUD', value: 'AUD' },
              ]}
            />
          </Form.Item>

          {/* Add an iterm to select the bill owner */}
          <Form.Item
            label='Owner'
            name='owner'
            rules={[
              {
                required: true,
                message: 'Please select a owner!',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder='Please select'
              options={existingMembers}
            />
          </Form.Item>

          {/* Add a member selection for whom pay the bill */}
          <Form.Item
            label='Payers (equal split)'
            name='payers'
            rules={[
              {
                required: true,
                message: 'Please select payers!',
              },
            ]}
          >
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              placeholder='Please select'
              options={existingMembers}
            />
          </Form.Item>

          <Form.Item
            label='Group'
            name='group'
            rules={[
              {
                required: true,
                message: 'Please select a group the bill belongs to!',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder='Please select'
              options={existingGroups}
            />
          </Form.Item>

          {/* Add a selection for category */}
          <Form.Item
            label='Category'
            name='category'
            rules={[
              {
                required: true,
                message: 'Please select a category!',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder='Please select'
              options={categoryList}
            />
          </Form.Item>

          <Form.Item label='Description' name='description'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        title='Finance Overview'
        bordered={false}
        style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title='Group Joined' value={groupData.length} />
          </Col>
          <Col span={8}>
            <Statistic title='Owned Bills' value={userBillData.length} />
          </Col>
        </Row>
        <Row gutter={10} style={{ marginTop: '1.5rem' }}>
          <Col span={8}>
            <Statistic
              title='Consumption Trend'
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix='%'
            />
          </Col>
          <Col span={6}>
            <Statistic
              title='Monthly Balance (USD)'
              value={1230.5}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title='Total Expense (USD)'
              value={13250.25}
              precision={2}
            />
          </Col>
        </Row>
      </Card>
      <Spin spinning={isBillLoading}>
        <Card
          title='My Bills'
          bordered={false}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          <div
            style={{
              marginBottom: '1rem',
              display: 'flex',
            }}
          >
            <Search
              placeholder='search the bill'
              onSearch={onSearch}
              enterButton
              style={{ width: '40%', marginRight: '5px' }}
            />
            <Button
              type='primary'
              style={{ marginRight: '5px' }}
              onClick={handleAddBill}
            >
              Add new bill
            </Button>
            <Button
              style={{ marginRight: '5px' }}
              onClick={handleBillSettle}
              danger
            >
              Settle up
            </Button>
            <Button style={{ marginRight: '5px' }}>Convert to USD</Button>
            <Button>Export</Button>
          </div>
          <Table
            rowKey='objectId'
            style={{ width: '100%' }}
            dataSource={userBillData}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
              },
              {
                title: 'Currency',
                dataIndex: 'currency',
                key: 'currency',
                render: (currency) => {
                  return <Tag>{currency.toUpperCase()}</Tag>
                },
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => {
                  let color = status === 'pending' ? 'gold' : 'green'
                  return (
                    <Tag color={color} key={status}>
                      {status.toUpperCase()}
                    </Tag>
                  )
                },
              },
              {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
              },
            ]}
          />
        </Card>
      </Spin>
    </PageContainer>
  )
}
