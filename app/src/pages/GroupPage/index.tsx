import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BillType from "../../types/bill";
import GroupType from "../../types/group";
import request from "umi-request";
import { apiEndpoint } from "../../service/service";
import { List, Button, Input, Space } from "antd";
import "./index.css";

interface Params {
  id: string;
  [key: string]: string | undefined; // Index signature
}

export default function GroupPage() {
  const { id } = useParams<Params>();
  const [billData, setBillData] = useState<BillType[]>([]);
  const [groupData, setGroupData] = useState<GroupType>({} as GroupType);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch group data
        const groupResponse = await request(apiEndpoint + "/group/" + id, {
          method: "GET",
        });

        setGroupData(groupResponse);

        // fetch bill data
        const userResponse = await request(apiEndpoint + "/bill/group/" + id, {
          method: "GET",
        });
        const formattedBillData = userResponse.map((bill: BillType) => ({
          name: bill.name,
          groupID: bill.groupID,
          billID: bill.billID,
          ownerID: bill.ownerID,
          ownerName: bill.ownerName,
          payerIDs: bill.payerIDs,
          payerNames: bill.payerNames,
          price: bill.price,
          status: bill.status,
          completeDate: bill.completeDate,
          createDate: bill.createDate,
        }));
        setBillData(formattedBillData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  });

  return (
    <div style={{ margin: "2.5rem" }}>
      <p>Group {groupData.name}</p>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "2rem" }}>
        <Space.Compact style={{ margin: "3px" }}>
          <Input placeholder="Search bill records" />
          <Button>Search</Button>
        </Space.Compact>
        <Button style={{ margin: "3px" }}>Add Bill</Button>
        <Button style={{ margin: "3px" }}>Add Member</Button>
        <Button type="primary" style={{ margin: "3px" }}>
          Settle up
        </Button>
      </div>

      <List
        style={{ width: "100%", marginTop: "2.5rem" }}
        itemLayout="horizontal"
        dataSource={billData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              style={{ textAlign: "left", paddingLeft: "20px" }}
              title={item.name}
              description={
                "paid by " + item.ownerName + ", borrowed by " + item.payerNames
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                padding: 0,
              }}
            >
              <>USD ${item.price}</>
              <p style={{ color: "grey", margin: 2 }}>{item.createDate}</p>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
