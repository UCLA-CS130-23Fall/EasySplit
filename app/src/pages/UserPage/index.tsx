import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, List, Spin, Popconfirm } from "antd";
import GroupType from "../../types/group";
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
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  const handleLogout = async () => {
    await Bmob.User.logout();
    navigate("/login");
  };

  const confirmLogout = () => {
    handleLogout();
  };

  const cancelLogout = () => {
    // do nothing
  };

  // fetch group data
  useEffect(() => {
    const query = Bmob.Query("Group");
    setIsGroupLoading(true);
    query
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
          }),
        );
        setGroupData(formattedGroupData);
      })
      .catch((err) => {
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
                onCancel={cancelLogout}
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
            <List
              style={{ width: "100%" }}
              itemLayout="horizontal"
              dataSource={groupData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    style={{ textAlign: "left", paddingLeft: "20px" }}
                    title={item.name}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Spin>
      </div>
    </>
  );
}
