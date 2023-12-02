import { PageContainer } from '@ant-design/pro-layout'
import {
  Card,
  Button,
  List,
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin,
  Popconfirm,
} from 'antd'
import type { SelectProps } from 'antd'
import { history } from '@vitjs/runtime'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { GroupType, UserType } from '@/type/es'

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
)

export default function Group() {
  const [form] = Form.useForm()
  const current = Bmob.User.current()
  const [groupData, setGroupData] = useState<GroupType[]>([])
  const [memberData, setMemberData] = useState<UserType[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isGroupLoading, setIsGroupLoading] = useState(false)
  const existingMembers: SelectProps['options'] = memberData.map((member) => ({
    label: member.username,
    value: member.objectId,
  }))

  const showModal = () => {
    setIsModalVisible(true)
  }

  const cancelModal = () => {
    // do nothing
  }

  const handleCreateGroupOk = () => {
    form.submit()
  }

  const handleCreateGroupCancel = () => {
    setIsModalVisible(false)
  }

  const handleAddGroup = () => {
    showModal()
  }

  const handleGroupDetail = (value: any) => {
    history.push(`/app/groupdetail?id=${value.objectId}`)
  }

  const onGroupFormFinish = (values: any) => {
    setIsModalVisible(false)

    // create group
    const group = Bmob.Query('Group')
    const pointer = Bmob.Pointer('_User')
    const ownerID = pointer.set(current.objectId)

    const relation = Bmob.Relation('_User')
    const memberIDx = relation.add(values.members)

    group.set('name', values.name)
    group.set('description', values.description)
    group.set('owner', ownerID)
    group.set('members', memberIDx)

    const newGroup = {
      name: values.name,
      description: values.description,
      owner: ownerID,
      members: memberIDx,
    }

    group.save().then(
      (res) => {
        setGroupData((prev) => [...prev, newGroup])
        message.success('Group created successfully! at ' + res.createdAt)
      },
      (err) => {
        message.error('Group created failed! ' + err.message)
      },
    )
  }

  const handleDeleteGroup = (e: any) => {
    const groupQuery = Bmob.Query('Group')
    groupQuery.destroy(e.objectId).then(
      () => {
        setGroupData((prev) =>
          prev.filter((group) => group.objectId !== e.objectId),
        )
        message.success('Group deleted successfully!')
      },
      (err) => {
        message.error('Group deleted failed! ' + err.message)
      },
    )
  }

  useEffect(() => {
    // fetch group data
    const groupQuery = Bmob.Query('Group')
    setIsGroupLoading(true)
    groupQuery
      .find()
      .then((res) => {
        setIsGroupLoading(false)
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
  }, [])

  return (
    <PageContainer>
      <Spin spinning={isGroupLoading}>
        <Card
          title='Groups'
          bordered={false}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          <Modal
            title='Create a new group'
            open={isModalVisible}
            onOk={handleCreateGroupOk}
            onCancel={handleCreateGroupCancel}
          >
            <Form
              form={form}
              name='basicForm'
              initialValues={{ remember: true }}
              onFinish={onGroupFormFinish}
              autoComplete='off'
            >
              <Form.Item
                label='Name'
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'Please input your name of the group!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label='Description' name='description'>
                <Input />
              </Form.Item>

              <Form.Item label='Members' name='members'>
                <Select
                  mode='multiple'
                  allowClear
                  style={{ width: '100%' }}
                  placeholder='Please select'
                  options={existingMembers}
                />
              </Form.Item>
            </Form>
          </Modal>

          <List
            style={{ width: '100%' }}
            itemLayout='horizontal'
            dataSource={groupData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    shape='circle'
                    icon={<EyeOutlined />}
                    onClick={() => handleGroupDetail(item)}
                  />,
                  <Popconfirm
                    title='Are you sure to delete this group?'
                    onConfirm={() => handleDeleteGroup(item)}
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
                  title={item.name}
                  description={item.description}
                />
              </List.Item>
            )}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '1rem',
            }}
          >
            <Button onClick={handleAddGroup}>Create a new group</Button>
          </div>
        </Card>
      </Spin>
    </PageContainer>
  )
}
