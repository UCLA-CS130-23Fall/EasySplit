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

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
)

export default function Dashboard() {
  const current = Bmob.User.current()
  const [form] = Form.useForm()
  const [isBillLoading, setIsBillLoading] = useState(false)
  const [isNewBillModalVisible, setIsNewBillModalVisible] = useState(false)
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

  const { Search } = Input

  useEffect(() => {
    // fetch bill data by the current user as the owner
    fetchCurrentUserBillData()
    // fetch member data
    fetchMemberData()
    // fetch group data by the current user as the owner
    fetchGroupData()
  }, [])

  const onSearch = (value: string) => console.log(value)

  const showNewBillModal = () => {
    setIsNewBillModalVisible(true)
  }

  const cancelModal = () => {
    // do nothing
  }

  const handleCreateBillOk = () => {
    form.submit()
  }

  const handleCreateBillCancel = () => {
    setIsNewBillModalVisible(false)
  }

  const handleAddBill = () => {
    showNewBillModal()
  }

  const onBillFormFinish = (values: any) => {
    setIsNewBillModalVisible(false)
    // create bill
    const bill = Bmob.Query('Bill')
    const userPointer = Bmob.Pointer('_User')
    const userPoiID = userPointer.set(current.objectId)

    const groupPointer = Bmob.Pointer('_User')
    const groupPoiID = groupPointer.set(values.group)

    const relation = Bmob.Relation('_User')
    const memberIDx = relation.add(values.payers)

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
      .then((res) => {
        message.success('Bill created successfully! at ' + res.createdAt)
        fetchCurrentUserBillData()
      })
      .catch((err) => {
        message.error('Bill created failed! ' + err.message)
        console.log(err)
      })
  }

  const fetchGroupData = () => {
    const groupQuery = Bmob.Query('Group')
    groupQuery
      .find()
      .then((res) => {
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

  const fetchCurrentUserBillData = () => {
    // fetch bill data by the current user as the owner
    const billQuery = Bmob.Query('Bill')
    setIsBillLoading(true)
    billQuery.equalTo('owner', '==', current.objectId)
    billQuery
      .find()
      .then((res) => {
        setIsBillLoading(false)
        const formattedBillData = (res as BillType[]).map((bill: BillType) => ({
          objectId: bill.objectId,
          name: bill.name,
          currency: bill.currency,
          payers: bill.payers,
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

  const fetchMemberData = () => {
    // fetch member data
    const memberQuery = Bmob.Query('_User')
    memberQuery
      .find()
      .then((res) => {
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

  return (
    <PageContainer>
      <Spin spinning={isBillLoading}>
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
          <Row gutter={12}>
            <Col span={12}>
              <Statistic
                title='Consumption this month'
                value={9.3}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
                suffix='%'
              />
            </Col>
            <Col span={12}>
              <Statistic
                title='Account Balance (USD)'
                value={1230.5}
                precision={2}
              />
            </Col>
          </Row>
        </Card>
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
              style={{ width: '50%', marginRight: '5px' }}
            />
            <Button
              type='primary'
              style={{ marginRight: '5px' }}
              onClick={handleAddBill}
            >
              Add new bill
            </Button>
            <Button style={{ marginRight: '5px' }} danger>
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
