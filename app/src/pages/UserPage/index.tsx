import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, List } from "antd";
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

  const handleLogout = async () => {
    await Bmob.User.logout();
    navigate("/login");
  };

  // fetch group data
  useEffect(() => {
    const query = Bmob.Query("Group");
    query
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
        <Card title={`User: ${id}`} bordered={false} style={{ width: "100%" }}>
          {/* User details */}
          <p>
            <strong>Email:</strong> {current.email}
          </p>
          <p>
            <strong>Phone:</strong> {current.phone}
          </p>
          <p>
            <strong>Username:</strong> {current.username}
          </p>
          {/* Logout button */}
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Card>
        <Card
          title="Bills"
          bordered={false}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <List
            style={{ width: "100%", marginTop: "2.5rem" }}
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
      </div>
    </>
  );
}
