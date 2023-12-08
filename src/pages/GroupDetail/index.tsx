import { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Tag,
  Spin,
  List,
  Popconfirm,
  Button,
  message,
  Descriptions,
  Row,
  Col,
  Statistic,
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import type { GroupType, BillType, UserType } from '@/type/es'

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
)

export default function GroupDetail() {
  const [groupData, setGroupData] = useState<GroupType>({} as GroupType)
  const [groupBillData, setGroupBillData] = useState<BillType[]>([])
  const [groupMemberData, setGroupMemberData] = useState<UserType[]>([])
  const [ownerData, setOwnerData] = useState<UserType>({} as UserType)
  const [isGroupLoading, setIsGroupLoading] = useState(false)
  const [isBillLoading, setIsBillLoading] = useState(false)
  const [isMemberLoading, setIsMemberLoading] = useState(false)
  const searchParams = new URLSearchParams(window.location.search)
  const groupId = searchParams.get('id') as string

  useEffect(() => {
    const groupQuery = Bmob.Query('Group')
    setIsGroupLoading(true)
    groupQuery.get(groupId).then((group : any) => {
      setIsGroupLoading(false)
      setGroupData({
        objectId: group.objectId,
        name: group.name,
        description: group.description,
        owner: group.owner.objectId,
        members: group.members,
        bills: group.bills,
        createAt: group.createAt,
        updateAt: group.updateAt,
      })
      fetchUserPointer(group.owner.objectId)
    })

    // fetch group bill data
    fetchCurrentGroupBillData()

    // fetch group member data
    fetchGroupMemberData()
  }, [])

  const cancelModal = () => {
    // do nothing
  }

  // delete user from the group
  const handleDeleteUser = (item: UserType) => {
    const groupQuery = Bmob.Query('Group')
    const relation = Bmob.Relation('_User') as any
    const relID = relation.remove([item.objectId])
    groupQuery
      .get(groupId)
      .then((res : any) => {
        res.set('members', relID)
        res.save()
        fetchGroupMemberData()
        message.success('Delete user successfully!')
      })
      .catch((err) => {
        console.log(err)
        message.error('Delete user failed!')
      })
  }

  const fetchGroupMemberData = () => {
    // fetch member data by the current group
    setIsMemberLoading(true)
    const groupQuery = Bmob.Query('Group')
    groupQuery.field('members', groupId)
    groupQuery
      .relation('_User')
      .then((res : any) => {
        const formattedMemberData = (res.results as UserType[]).map(
          (member) => ({
            objectId: member.objectId,
            username: member.username,
            email: member.email,
            phone: member.phone,
            group: groupId,
            createAt: member.createAt,
            updateAt: member.updateAt,
          }),
        )
        setIsMemberLoading(false)
        setGroupMemberData(formattedMemberData)
      })
      .catch((err) => {
        console.log(err)
        setIsMemberLoading(false)
      })
  }

  const fetchUserPointer = (userId: string) => {
    const query = Bmob.Query('Group')
    query.include('owner', userId)
    query
      .find()
      .then((res : any) => {
        setOwnerData({
          objectId: res[0].owner.objectId,
          username: res[0].owner.username,
          email: res[0].owner.email,
          phone: res[0].owner.phone,
          createAt: res[0].owner.createAt,
          updateAt: res[0].owner.updateAt,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const fetchCurrentGroupBillData = () => {
    // fetch bill data by the current user as the owner
    setIsBillLoading(true)
    const billQuery = Bmob.Query('Bill')

    const groupPointer = Bmob.Pointer('Group')
    const groupPoiID = groupPointer.set(groupId)

    billQuery.equalTo('group', '==', groupPoiID)
    billQuery
      .find()
      .then((res : any) => {
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
      <Spin spinning={isGroupLoading}>
        <Card
          title={'Group Details'}
          bordered={false}
          style={{ width: '100%', padding: '1rem' }}
        >
          <Descriptions>
            <Descriptions.Item label='Name'>{groupData.name}</Descriptions.Item>
            <Descriptions.Item label='Descriptions'>
              {groupData.description}
            </Descriptions.Item>
            <Descriptions.Item label='Owner Name'>
              {ownerData.username}
            </Descriptions.Item>
          </Descriptions>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title='Active Members'
                value={groupMemberData.length}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title='Number of Unpaid Bills'
                value={
                  groupBillData.filter((bill) => bill.status == 'pending')
                    .length
                }
              />
            </Col>
            <Col span={8}>
              <Statistic
                title='Total Number of Bills'
                value={groupBillData.length}
              />
            </Col>
          </Row>
        </Card>
      </Spin>
      <Spin spinning={isMemberLoading}>
        <Card
          title='Group Members'
          bordered={false}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          <List
            style={{ width: '100%' }}
            itemLayout='horizontal'
            dataSource={groupMemberData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Popconfirm
                    title='Are you sure to remove this user?'
                    onConfirm={() => handleDeleteUser(item)}
                    onCancel={cancelModal}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button shape='circle' icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  style={{ textAlign: 'left', paddingLeft: '20px' }}
                  title={item.username}
                  description={item.email}
                />
              </List.Item>
            )}
          />
        </Card>
      </Spin>

      <Spin spinning={isBillLoading}>
        <Card
          title='Group Bills'
          bordered={false}
          style={{ width: '100%', marginTop: '1rem' }}
        >
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
