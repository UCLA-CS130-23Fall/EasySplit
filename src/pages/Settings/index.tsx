import { PageContainer } from '@ant-design/pro-layout'
import {
  Card,
  Button,
  Popconfirm,
  Avatar,
  Form,
  Input,
  Divider,
  Switch,
  Select,
  message,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { history } from '@vitjs/runtime'

const { Option } = Select

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
)

export default function Settings() {
  const current = Bmob.User.current() as any

  const confirmLogout = () => {
    handleLogout()
  }

  const cancelModal = () => {
    // do nothing
  }

  const onFinish = async (values: any) => {
    console.log(values)
    message.success('Settings saved!')
  }

  const handleLogout = async () => {
    await Bmob.User.logout()
    history.push('/')
  }

  // Define default values
  const defaultFormValues = {
    username: current.username,
    email: current.email,
    phoneNumber: current.phone,
    currency: 'USD',
    notifications: true,
  }

  return (
    <PageContainer>
      <Card title={'User Settings'} bordered={false} style={{ width: '100%' }}>
        <Card.Meta
          avatar={<Avatar icon={<UserOutlined />} size='large' />}
          title={current.username}
          description={
            <>
              <p>Email: {current.email}</p>
              <p>Phone: {current.phone}</p>
            </>
          }
        />
        {/* Logout button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Popconfirm
            title='Are you sure to log out?'
            onConfirm={confirmLogout}
            onCancel={cancelModal}
            okText='Yes'
            cancelText='No'
          >
            <Button>Logout</Button>
          </Popconfirm>
        </div>
      </Card>
      <Card
        title={'User Settings'}
        bordered={false}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        <Form
          layout='vertical'
          onFinish={onFinish}
          initialValues={defaultFormValues}
        >
          <Form.Item label='Username' name='username'>
            <Input placeholder='Username' />
          </Form.Item>

          <Form.Item label='Email Address' name='email'>
            <Input placeholder='Email Address' />
          </Form.Item>

          <Form.Item label='Phone Number' name='phoneNumber'>
            <Input placeholder='Phone Number' />
          </Form.Item>

          <Divider />

          <Form.Item label='Currency' name='currency'>
            <Select placeholder='Select currency'>
              <Option value='USD'>USD</Option>
              <Option value='CNY'>CNY</Option>
              <Option value='JPY'>JPY</Option>
              <Option value='EUR'>EUR</Option>
              <Option value='GBP'>GBP</Option>
              <Option value='KRW'>KRW</Option>
              <Option value='SGD'>SGD</Option>
              <Option value='CAD'>CAD</Option>
              <Option value='AUD'>AUD</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label='Enable Notifications'
            name='notifications'
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>

          <Divider />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Save Changes
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </PageContainer>
  )
}
