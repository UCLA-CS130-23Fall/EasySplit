import { useEffect, useState } from "react";
import { Select } from "antd";
import request from "umi-request";
import { useNavigate } from "react-router-dom";
import GroupType from "../../types/group";
import UserType from "../../types/user";
import "./index.css";

function HomePage() {
  const [userData, setUserData] = useState<{ value: string; label: string }[]>(
    []
  );

  const [groupData, setGroupData] = useState<
    { value: string; label: string }[]
  >([]);

  const navigate = useNavigate();

  const onUserChange = (value: string) => {
    navigate(`/user/${value}`);
  };

  const onGroupChange = (value: string) => {
    navigate(`/group/${value}`);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch user data
        const userResponse = await request("http://0.0.0.0:8000/user");
        const formattedUserData = userResponse.map((user: UserType) => ({
          value: user.userID,
          label: user.username,
        }));
        setUserData(formattedUserData);

        // featch group data
        const response = await request("http://0.0.0.0:8000/group");
        const formattedGroupData = response.map((group: GroupType) => ({
          value: group.groupID,
          label: group.name,
        }));
        setGroupData(formattedGroupData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Easy Split</h1>
      <div>
        <Select
          showSearch
          style={{ width: "20%", marginTop: "25px" }}
          placeholder="Please select a user"
          optionFilterProp="children"
          onChange={onUserChange}
          filterOption={filterOption}
          options={userData}
        />
        <p>or</p>
        <Select
          showSearch
          style={{ width: "20%", marginTop: "5px" }}
          placeholder="Please select a group"
          optionFilterProp="children"
          onChange={onGroupChange}
          filterOption={filterOption}
          options={groupData}
        />
      </div>
    </div>
  );
}

export default HomePage;
