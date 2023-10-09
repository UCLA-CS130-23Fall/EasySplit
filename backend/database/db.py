from tinydb import Query
from typing import List, Union

from backend.model import BillStatus
from backend.model import Bill, User, Group
from backend.utils import initialize_db, initialize_id


class DBHandler:

    def __init__(self):
        """
        Initializing TinyDB
        """
        self.db_groups = initialize_db('groups')
        self.db_users = initialize_db('users')
        self.db_bills = initialize_db('bills')

    def create_group(self, group: Group) -> Group:
        """
        create_group: create a group.
        :param group: the group.
        :return: the new group.
        """
        group.groupID = initialize_id()
        self.db_groups.insert(group.dict())
        return group

    def get_group(self, group_id: str) -> Union[Group, None]:
        """
        get_group: get the group.
        :param group_id:  the group id.
        :return: the group.
        """
        group_query = Query()
        group_data = self.db_groups.get(group_query.groupID == group_id)
        return Group(**group_data) if group_data else None

    def update_group(self, group_id: str, updated_group: Group) -> Union[Group, None]:
        """
        update_group: update the group.
        :param group_id: the group id.
        :param updated_group: the updated group.
        :return: the updated group.
        """
        original_group = self.get_group(group_id)
        if not original_group:
            return None
        else:
            updated_group.groupID = original_group.groupID

            # the ownerID should be existed in the user table
            existing_user = self.db_users.search(Query().userID == updated_group.ownerID)
            if not existing_user:
                raise ValueError(f"Owner {updated_group.ownerID} does not exist.")

            # the memberIDs should be existed in the user table
            for member in updated_group.memberIDs:
                existing_user = self.db_users.search(Query().userID == member)
                if not existing_user:
                    raise ValueError(f"Member {member} does not exist.")

            group_query = Query()
            self.db_groups.update(updated_group.dict(), group_query.groupID == group_id)
            return updated_group

    def delete_group(self, group_id: str) -> str:
        """
        delete_group: delete the group.
        :param group_id: the group id.
        :return: the group id.
        """
        group_query = Query()
        self.db_groups.remove(group_query.groupID == group_id)
        return group_id

    # Functions for User model
    def create_user(self, user: User) -> User:
        """
        create_user: create a user.
        :param user: the user.
        :return: the new user.
        """
        user.userID = initialize_id()
        self.db_users.insert(user.dict())
        return user

    def get_user(self, user_id: str) -> Union[User, None]:
        """
        get_user: get the user.
        :param user_id: the user id.
        :return: the user.
        """
        user_query = Query()
        user_data = self.db_users.get(user_query.userID == user_id)
        return User(**user_data) if user_data else None

    def update_user(self, user_id: str, updated_user: User) -> Union[User, None]:
        """
        update_user: update the user.
        :param user_id: the user id.
        :param updated_user: the updated user.
        :return: the updated user.
        """
        original_user = self.get_user(user_id)
        if not original_user:
            return None
        else:
            updated_user.userID = original_user.userID
            user_query = Query()
            self.db_users.update(updated_user.dict(), user_query.userID == user_id)
            return updated_user

    def delete_user(self, user_id: str) -> str:
        """
        delete_user: delete the user.
        :param user_id: the user id.
        :return: the user id.
        """
        user_query = Query()
        self.db_users.remove(user_query.userID == user_id)
        return user_id

    # Functions for Bill model
    def create_bill(self, bill: Bill) -> Bill:
        """
        create_bill: create a bill.
        :param bill: the bill.
        :return: the new bill.
        """
        bill.billID = initialize_id()

        # the groupID should be existed in the group table
        existing_group = self.db_groups.search(Query().groupID == bill.groupID)
        if not existing_group:
            raise ValueError(f"Group {bill.groupID} does not exist.")

        # the ownerID should be existed in the user table
        existing_owner = self.db_users.search(Query().userID == bill.ownerID)
        bill.ownerName = existing_owner[0]['username'] if existing_owner else None
        if not existing_owner:
            raise ValueError(f"Owner {bill.ownerID} does not exist.")

        # the payerIDs should be existed in the user table
        bill.payerNames = []
        for payer in bill.payerIDs:
            existing_payer = self.db_users.search(Query().userID == payer)
            bill.payerNames.append(existing_payer[0]['username']) if existing_payer else None
            if not existing_payer:
                raise ValueError(f"Payer {payer} does not exist.")

        self.db_bills.insert(bill.dict())
        return bill

    def get_bill(self, bill_id: str) -> Union[Bill, None]:
        """
        get_bill: get the bill.
        :param bill_id: the bill id.
        :return: the bill.
        """
        bill_query = Query()
        bill_data = self.db_bills.get(bill_query.billID == bill_id)
        return Bill(**bill_data) if bill_data else None

    def update_bill(self, bill_id: str, updated_bill: Bill) -> Union[Bill, None]:
        """
        update_bill: update the bill.
        :param bill_id: the bill id.
        :param updated_bill: the updated bill.
        :return: the bill.
        """
        original_bill = self.get_bill(bill_id)
        if not original_bill:
            return None
        else:
            updated_bill.billID = original_bill.billID

            bill_query = Query()
            self.db_bills.update(updated_bill.dict(), bill_query.billID == bill_id)
            return updated_bill

    def delete_bill(self, bill_id: str) -> str:
        """
        delete_bill: delete the bill.
        :param bill_id: the bill id.
        :return: the bill id.
        """
        bill_query = Query()
        self.db_bills.remove(bill_query.billID == bill_id)
        return bill_id

    def get_all_groups(self) -> List[Group]:
        """
        get_all_groups: get all groups.
        :return: the groups.
        """
        return [Group(**item) for item in self.db_groups.all()]

    def get_group_by_user(self, user_id: str) -> List[Group]:
        """
        get_group_by_user: get all groups that the user is in.
        :param user_id: the user id.
        :return: the groups.
        """
        return [group for group in self.get_all_groups() if user_id in group.memberIDs]

    def get_all_users(self) -> List[User]:
        """
        get_all_users: get all users.
        :return: the users.
        """
        return [User(**item) for item in self.db_users.all()]

    def get_all_bills(self, status: BillStatus = None) -> List[Bill]:
        """
        get_all_bills: get all bills.
        :param status: the bill status.
        :return: the bills.
        """
        if status:
            return [bill for bill in self.get_all_bills() if bill.status == status]
        else:
            return [Bill(**item) for item in self.db_bills.all()]

    def get_bill_by_group(self, group_id: str) -> List[Bill]:
        """
        get_bill_by_group: get all bills in the group.
        :param group_id: the group id.
        :return: the bills.
        """
        return [bill for bill in self.get_all_bills() if bill.groupID == group_id]
