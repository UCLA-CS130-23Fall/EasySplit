import os
import uuid

from pathlib import Path
from tinydb import TinyDB


def initialize_db(db_name: str) -> TinyDB:
    """
    Initialize a TinyDB instance.

    :param db_name: Name of the database file (without extension).
    :return: TinyDB instance.
    """
    # Define the path to the database file.
    home_path = Path.home()
    es_path = Path(os.path.join(home_path, ".easysplit", "database"))

    # Ensure the path exists.
    es_path.mkdir(parents=True, exist_ok=True)

    # Initialize and return the database.
    return TinyDB(es_path / f"{db_name}.json")


def initialize_id() -> str:
    """
    Generate a UUID.

    :return: UUID.
    """
    return str(uuid.uuid4())
