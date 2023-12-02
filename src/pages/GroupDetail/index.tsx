import { useEffect, useState } from 'react'
import { Card, Table, Tag, Spin } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import type { GroupType, BillType } from '@/type/es'

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
)

export default function GroupDetail() {
  const [groupData, setGroupData] = useState<GroupType>({} as GroupType)
  const [groupBillData, setGroupBillData] = useState<BillType[]>([])
  const [isGroupLoading, setIsGroupLoading] = useState(false)
  const [isBillLoading, setIsBillLoading] = useState(false)
  const searchParams = new URLSearchParams(window.location.search);
  const groupId = searchParams.get('id');

  useEffect(() => {
    const groupQuery = Bmob.Query('Group')
    setIsGroupLoading(true)
    groupQuery.get(groupId).then((group) => {
      setIsGroupLoading(false)
      setGroupData({
        objectId: group.objectId,
            name: group.name,
            description: group.description,
            owner: group.owner,
            members: group.members,
            bills: group.bills,
            createAt: group.createAt,
            updateAt: group.updateAt,
      })
    })

    // fetch group bill data
    fetchCurrentGroupBillData()
  }, [])

  const fetchCurrentGroupBillData = () => {
    // fetch bill data by the current user as the owner
    setIsBillLoading(true)
    const billQuery = Bmob.Query('Bill')

    const groupPointer = Bmob.Pointer('Group')
    const groupPoiID = groupPointer.set(groupId)

    billQuery.equalTo('group', '==', groupPoiID)
    billQuery
      .find()
      .then((res) => {
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
        setGroupBillData(formattedBillData)
        setIsBillLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setIsBillLoading(false)
      })
  }

  return (
    <PageContainer>
      <Spin
        spinning={isGroupLoading}
      >
      <Card
        title={'Group Details'}
        bordered={false}
        style={{ width: '100%' }}
      >

        <p>Group Name: {groupData.name}</p>
        <p>Group Description: {groupData.description}</p>
      </Card>
      </Spin>
      <Card title="Group Members" bordered={false} style={{ width: '100%', marginTop: "1rem" }}>
      </Card>
      <Spin
        spinning={isBillLoading}
      >
      <Card title="Group Bills" bordered={false} style={{ width: '100%', marginTop: "1rem" }}>
      <Table
            rowKey='objectId'
            style={{ width: '100%' }}
            dataSource={groupBillData}
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
