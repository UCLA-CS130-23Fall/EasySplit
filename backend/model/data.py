import enum
from pydantic import BaseModel
from typing import List, Optional


class BillStatus(enum.Enum):
    """
    BillStatus: represents the status of a bill.
    """
    CLEAR = "clear"
    PENDING = "pending"


class Group(BaseModel):
    """
    Group: represents a group.
    """
    groupID: Optional[str]
    name: str
    description: str
    ownerID: str
    memberIDs: List[str]
    billIDs: List[str]
    createDate: Optional[str]


class User(BaseModel):
    """
    User: represents a user.
    """
    userID: Optional[str]
    username: str
    password: str
    email: str


class Bill(BaseModel):
    """
    BillItem: represents a bill item.
    """
    name: str
    groupID: str
    billID: Optional[str]
    ownerID: str
    ownerName: Optional[str]
    payerIDs: List[str]
    payerNames: Optional[List[str]]
    price: float
    status: Optional[BillStatus]
    createDate: Optional[str]
    completeDate: Optional[str]

    class Config:
        use_enum_values = True
