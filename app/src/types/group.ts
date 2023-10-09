interface GroupType {
  groupID?: string;
  name: string;
  description: string;
  ownerID: string;
  memberIDs: string[];
  billIDs: string[];
  createDate?: string;  // ISO string format for date
}

export default GroupType;