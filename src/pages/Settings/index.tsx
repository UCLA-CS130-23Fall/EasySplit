import { PageContainer } from '@ant-design/pro-layout'
import { Card, Button, Popconfirm } from 'antd'
import { history } from '@vitjs/runtime'

import Bmob from 'hydrogen-js-sdk'

export default function Settings() {
  const current = Bmob.User.current()

  const confirmLogout = () => {
    handleLogout()
  }

  const cancelModal = () => {
    // do nothing
  }

  const handleLogout = async () => {
    await Bmob.User.logout()
    history.push('/')
  }

  return (
    <PageContainer>
      <Card title={'User Settings'} bordered={false} style={{ width: '100%' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {/* User details */}
          <div style={{ flex: 1 }}>
            <p>
              <strong>Username:</strong> {current.username}
            </p>
            <p>
              <strong>Email:</strong> {current.email}
            </p>
            <p>
              <strong>Phone:</strong> {current.phone}
            </p>
          </div>
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
        </div>
      </Card>
    </PageContainer>
  )
}
