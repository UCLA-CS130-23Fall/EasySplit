interface GroupType {
  objectId?: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  bills: string[];
  createAt?: string; // ISO string format for date
  updateAt?: string; // ISO string format for date
}

export default GroupType;
