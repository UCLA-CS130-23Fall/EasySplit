interface BillType {
  objectId?: string;
  name: string;
  group: string;
  owner: string;
  payers: string[];
  description?: string;
  price: number;
  status: string;
  createAt?: string;
  updateAt?: string;
  completeAt?: string;
}

export default BillType;
