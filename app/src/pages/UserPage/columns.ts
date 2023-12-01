export const billColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Group",
    dataIndex: "group",
    key: "group",
  },
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    render: (owner: string) => owner,
  },
  {
    title: "Payers",
    dataIndex: "payers",
    key: "payers",
    render: (payers: string[]) => payers.join(", "),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
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
    title: "Created At",
    dataIndex: "createAt",
    key: "createAt",
  },
];
