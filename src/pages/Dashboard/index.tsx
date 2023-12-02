import { useEffect, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { BillType } from '@/type/es'
import { Card, Spin, Table } from 'antd'

import Bmob from 'hydrogen-js-sdk'

export default function Dashboard() {
  const current = Bmob.User.current()
  const [isBillLoading, setIsBillLoading] = useState(false)
  const [userBillData, setUserBillData] = useState<BillType[]>([])

  useEffect(() => {
    // fetch bill data by the current user as the owner
    const billQuery = Bmob.Query('Bill')
    setIsBillLoading(true)
    const current = Bmob.User.current()
    billQuery.equalTo('owner', '==', current.objectId)
    billQuery
      .find()
      .then((res) => {
        setIsBillLoading(false)
        const formattedBillData = (res as BillType[]).map((bill: BillType) => ({
          objectId: bill.objectId,
          name: bill.name,
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
  }, [])

  return (
    <PageContainer>
      <Spin spinning={isBillLoading}>
        <Card
          title='Bills'
          bordered={false}
          style={{ width: '100%', marginTop: '1rem' }}
        >
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
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
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
