import { PageContainer } from '@ant-design/pro-layout'
import { Card } from 'antd'

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
)

export default function GroupDetail() {
  return (
    <PageContainer>
      <Card
        title={'Group Details'}
        bordered={false}
        style={{ width: '100%' }}
      ></Card>
    </PageContainer>
  )
}
