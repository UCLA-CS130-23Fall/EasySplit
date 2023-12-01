interface UserType {
  objectId?: string;
  username: string;
  phone: string;
  mobilePhoneNumber?: string;
  password?: string;
  email: string;
  createAt?: string; // ISO string format for date
  updateAt?: string; // ISO string format for date
}

export default UserType;
