from pydantic import BaseModel

from typing import List, Optional


class Group(BaseModel):
    """
    Group: represents a group.
    """
    groupID: Optional[str]
    name: str
    description: str
    ownerID: str
    memberIDs: List[str]


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
    groupID: str
    billID: Optional[str]
    ownerID: str
    payerIDs: List[str]
    price: float
