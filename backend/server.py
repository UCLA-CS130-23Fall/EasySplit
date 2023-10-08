from typing import List

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from backend.database import DBHandler
from backend.model import BillStatus, Bill, User, Group

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

db_handler = DBHandler()


@app.get("/")
def read_root():
    """
    read_root: read the root.
    :return: the root.
    """
    return {"Hello": "World"}


@app.get("/user/{user_id}", response_model=User)
async def get_user(user_id: str):
    """
    get_user: get the user.
    :param user_id: the user id.
    :return: the user.
    """
    user_resp = db_handler.get_user(user_id)
    if not user_resp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User {user_id} not found.")
    else:
        return user_resp


@app.get("/user", response_model=List[User])
async def get_all_users():
    """
    get_all_users: get all the users.
    :return: all the users.
    """
    return db_handler.get_all_users()


@app.post("/user", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
    """
    create_user: create a new user.
    :param user: The user details to be created.
    :return: the created user.
    """
    all_users = db_handler.get_all_users()
    if user.username in [existing_user.username for existing_user in all_users]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists.")
    elif user.email in [existing_user.email for existing_user in all_users]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists.")
    else:
        user = db_handler.create_user(user)

    return user


@app.put("/user/{user_id}", response_model=User)
async def update_user(user_id: str, user: User):
    """
    update_user: update the user.
    :param user_id: the user id.
    :param user: the user.
    :return: the updated user.
    """
    user_resp = db_handler.update_user(user_id, user)
    if not user_resp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User {user_id} not found.")
    return user


@app.delete("/user/{user_id}")
async def delete_user(user_id: str):
    """
    delete_user: delete the user.
    :param user_id: the user id.
    :return: the user id.
    """
    db_handler.delete_user(user_id)
    return {"detail": f"User {user_id} deleted successfully."}


@app.get("/group", response_model=List[Group])
async def get_all_groups():
    """
    get_all_groups: get all the groups.
    :return: all the groups.
    """
    return db_handler.get_all_groups()


@app.get("/group/{group_id}", response_model=Group)
async def get_group(group_id: str):
    """
    get_group: get the group.
    :param group_id: the group id.
    :return: the group.
    """
    group_resp = db_handler.get_group(group_id)
    if not group_resp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Group {group_id} not found.")
    else:
        return group_resp


@app.post("/group", response_model=Group, status_code=status.HTTP_201_CREATED)
async def create_group(group: Group):
    """
    create_group: create a new group.
    :param group: The group details to be created.
    :return: the created group.
    """
    group_members = group.memberIDs
    all_users = db_handler.get_all_users()

    # add owner to member list.
    group.memberIDs.append(group.ownerID)

    if group.ownerID not in [existing_user.userID for existing_user in all_users]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Owner {group.ownerID} does not exist.")

    for member in group_members:
        if member not in [existing_user.userID for existing_user in all_users]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Member {member} does not exist.")

    db_handler.create_group(group)
    return group


@app.delete("/group/{group_id}")
async def delete_group(group_id: str):
    """
    delete_group: delete the group.
    :param group_id: the group id.
    :return: the group id.
    """
    db_handler.delete_group(group_id)
    return {"detail": f"Group {group_id} deleted successfully."}


@app.put("/group/{group_id}", response_model=Group)
async def update_group(group_id: str, group: Group):
    """
    update_group: update the group.
    :param group_id: the group id.
    :param group: the group.
    :return: the updated group.
    """
    try:
        group_resp = db_handler.update_group(group_id, group)
        if not group_resp:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Group {group_id} not found.")

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return group


@app.get("/bill/group/{group_id}", response_model=List[Bill])
async def get_group_bills(group_id: str):
    """
    get_bill: get the bill.
    :param group_id: the group id.
    :return: the group bills.
    """
    return db_handler.get_bill_by_group(group_id)


@app.get("/bill/user/{user_id}", response_model=List[Bill])
async def get_user_bills(user_id: str, owner: bool = False, bill_status: BillStatus = None):
    """
    get_user_bill: get the user bill.
    :param user_id: get the user id.
    :param owner: whether the user is the owner.
    :param bill_status: the bill status.
    :return: the user bill.
    """
    all_bills = db_handler.get_all_bills(status=bill_status)

    if owner:
        return [bill for bill in all_bills if bill.ownerID == user_id]
    else:
        return [bill for bill in all_bills if user_id in bill.payerIDs]


@app.get("/bill/{bill_id}", response_model=Bill)
async def get_bill(bill_id: str):
    """
    get_bill: get the bill.
    :param bill_id: the bill id.
    :return: the bill.
    """
    return db_handler.get_bill(bill_id)


@app.get("/bill", response_model=List[Bill])
async def get_all_bills(bill_status: str = None):
    """
    get_all_bills: get all the bills.
    :param bill_status: the bill status.
    :return: all the bills.
    """
    return db_handler.get_all_bills(status=bill_status)


@app.post("/bill", response_model=Bill, status_code=status.HTTP_201_CREATED)
async def create_bill(bill: Bill):
    """
    create_bill: create a new bill.
    :param bill: The bill details to be created.
    :return: the created bill.
    """
    try:
        db_handler.create_bill(bill)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return bill


@app.put("/bill/{bill_id}", response_model=Bill)
async def update_bill(bill_id: str, bill: Bill):
    """
    update_bill: update the bill.
    :param bill_id: the bill id.
    :param bill: the bill.
    :return: the updated bill.
    """
    bill_resp = db_handler.update_bill(bill_id, bill)
    if not bill_resp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Bill {bill_id} not found.")
    return bill


@app.delete("/bill/{bill_id}")
async def delete_bill(bill_id: str):
    """
    delete_bill: delete the bill.
    :param bill_id: the bill id.
    :return: the bill id.
    """
    db_handler.delete_bill(bill_id)
    return {"detail": f"Bill {bill_id} deleted successfully."}


if __name__ == "__main__":
    """main: the main function."""
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
