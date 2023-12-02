export interface BillType {
  objectId?: string
  name: string
  group: string
  owner: string
  payers: string[]
  description?: string
  price: number
  status: string
  createAt?: string
  updateAt?: string
  completeAt?: string
}

export interface GroupType {
  objectId?: string
  name: string
  description: string
  owner: string
  members: string[]
  bills: string[]
  createAt?: string // ISO string format for date
  updateAt?: string // ISO string format for date
}

export interface UserType {
  objectId?: string
  username: string
  phone: string
  mobilePhoneNumber?: string
  password?: string
  email: string
  createAt?: string // ISO string format for date
  updateAt?: string // ISO string format for date
}
