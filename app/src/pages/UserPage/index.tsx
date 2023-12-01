import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Card,
	Button,
	List,
	Modal,
	Form,
	Input,
	Select,
	message,
	Table,
	Spin,
	Popconfirm,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { SelectProps } from "antd";
import GroupType from "../../types/group";
import UserType from "../../types/user";
import BillType from "../../types/bill";
import "./index.css";

import Bmob from "hydrogen-js-sdk";

interface Params {
	id: string;
	[key: string]: string | undefined;
}

export default function LoginPage() {
	const { id } = useParams<Params>();
	const navigate = useNavigate();
	const current = Bmob.User.current();
	const [groupData, setGroupData] = useState<GroupType[]>([]);
	const [memberData, setMemberData] = useState<UserType[]>([]);
	const [userBillData, setUserBillData] = useState<BillType[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isGroupLoading, setIsGroupLoading] = useState(false);
	const [isBillLoading, setIsBillLoading] = useState(false);
	const [form] = Form.useForm();

	const existingMembers: SelectProps["options"] = memberData.map((member) => ({
		label: member.username,
		value: member.objectId,
	}));

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCreateGroupOk = () => {
		form.submit();
	};

	const handleCreateGroupCancel = () => {
		setIsModalVisible(false);
	};

	const confirmLogout = () => {
		handleLogout();
	};

	const cancelModal = () => {
		// do nothing
	};

	const handleLogout = async () => {
		await Bmob.User.logout();
		navigate("/login");
	};

	const handleAddBill = () => {
		showModal();
	};

	const onGroupFormFinish = (values: any) => {
		setIsModalVisible(false);

		// create group
		const group = Bmob.Query("Group");
		const pointer = Bmob.Pointer("_User");
		const ownerID = pointer.set(current.objectId);

		const relation = Bmob.Relation("_User");
		const memberIDx = relation.add(values.members);

		group.set("name", values.name);
		group.set("description", values.description);
		group.set("owner", ownerID);
		group.set("members", memberIDx);

		const newGroup = {
			name: values.name,
			description: values.description,
			owner: ownerID,
			members: memberIDx,
		};

		group.save().then(
			(res) => {
				setGroupData((prev) => [...prev, newGroup]);
				message.success("Group created successfully! at " + res.createdAt);
			},
			(err) => {
				message.error("Group created failed! " + err.message);
			}
		);
	};

	const handleDeleteGroup = (e: any) => {
		const groupQuery = Bmob.Query("Group");
		groupQuery.destroy(e.objectId).then(
			() => {
				setGroupData((prev) =>
					prev.filter((group) => group.objectId !== e.objectId)
				);
				message.success("Group deleted successfully!");
			},
			(err) => {
				message.error("Group deleted failed! " + err.message);
			}
		);
	};

	useEffect(() => {
		// fetch group data
		const groupQuery = Bmob.Query("Group");
		setIsGroupLoading(true);
		groupQuery
			.find()
			.then((res) => {
				setIsGroupLoading(false);
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
					})
				);
				setGroupData(formattedGroupData);
			})
			.catch((err) => {
				console.log(err);
			});

		// fetch member data
		const memberQuery = Bmob.Query("_User");
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
					})
				);
				setMemberData(formattedMemberData);
			})
			.catch((err) => {
				console.log(err);
			});

		// fetch bill data by the current user as the owner
		const billQuery = Bmob.Query("Bill");
		setIsBillLoading(true);
		const current = Bmob.User.current();
		billQuery.equalTo("owner", "==", current.objectId);
		billQuery
			.find()
			.then((res) => {
				setIsBillLoading(false);
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
				}));
				setUserBillData(formattedBillData);
			})
			.catch((err) => {
				setIsBillLoading(false);
				console.log(err);
			});
	}, []);

	return (
		<>
			<div style={{ padding: "20px" }}>
				<Card
					title={"User Profile: " + id}
					bordered={false}
					style={{ width: "100%" }}
				>
					<div
						style={{ display: "flex", flexDirection: "column", height: "100%" }}
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
						<div style={{ display: "flex", justifyContent: "flex-end" }}>
							<Popconfirm
								title="Logout"
								description="Are you sure to log out?"
								onConfirm={confirmLogout}
								onCancel={cancelModal}
								okText="Yes"
								cancelText="No"
							>
								<Button>Logout</Button>
							</Popconfirm>
						</div>
					</div>
				</Card>
				<Spin spinning={isGroupLoading}>
					<Card
						title="Groups"
						bordered={false}
						style={{ width: "100%", marginTop: "1rem" }}
					>
						<Modal
							title="Create a new group"
							open={isModalVisible}
							onOk={handleCreateGroupOk}
							onCancel={handleCreateGroupCancel}
						>
							<Form
								form={form}
								name="basicForm"
								initialValues={{ remember: true }}
								onFinish={onGroupFormFinish}
								autoComplete="off"
							>
								<Form.Item
									label="Name"
									name="name"
									rules={[
										{
											required: true,
											message: "Please input your name of the group!",
										},
									]}
								>
									<Input />
								</Form.Item>

								<Form.Item label="Description" name="description">
									<Input />
								</Form.Item>

								<Form.Item label="Members" name="members">
									<Select
										mode="multiple"
										allowClear
										style={{ width: "100%" }}
										placeholder="Please select"
										options={existingMembers}
									/>
								</Form.Item>
							</Form>
						</Modal>

						<List
							style={{ width: "100%" }}
							itemLayout="horizontal"
							dataSource={groupData}
							renderItem={(item) => (
								<List.Item
									actions={[
										<Popconfirm
											title="Logout"
											description="Are you sure to delete this group?"
											onConfirm={() => handleDeleteGroup(item)}
											onCancel={cancelModal}
											okText="Yes"
											cancelText="No"
										>
											<Button shape="circle" icon={<DeleteOutlined />} />
										</Popconfirm>,
									]}
								>
									<List.Item.Meta
										style={{ textAlign: "left", paddingLeft: "20px" }}
										title={item.name}
										description={item.description}
									/>
								</List.Item>
							)}
						/>

						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								marginTop: "1rem",
							}}
						>
							<Button onClick={handleAddBill}>Create a new group</Button>
						</div>
					</Card>
				</Spin>
				<Spin spinning={isBillLoading}>
					<Card
						title="Bills"
						bordered={false}
						style={{ width: "100%", marginTop: "1rem" }}
					>
						<Table
							rowKey="objectId"
							style={{ width: "100%" }}
							dataSource={userBillData}
							columns={[
								{
									title: "Name",
									dataIndex: "name",
									key: "name",
								},
								{
									title: "Price",
									dataIndex: "price",
									key: "price",
								},
								{
									title: "Status",
									dataIndex: "status",
									key: "status",
								},
								{
									title: "Description",
									dataIndex: "description",
									key: "description",
								},
							]}
						/>
					</Card>
				</Spin>
			</div>
		</>
	);
}
