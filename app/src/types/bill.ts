interface BillType {
  name: string;
  groupID?: string;
  billID: string;
  ownerID: string;
  ownerName: string;
  payerIDs: string[];
  payerNames: string[];
  price: number;
  status: string;
  createDate?: string;
  completeDate?: string;
}

export default BillType;