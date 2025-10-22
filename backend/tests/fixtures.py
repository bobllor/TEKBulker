from logger import Log
from pathlib import Path
from db.database import Database
import pytest

@pytest.fixture
def logger():
    logger: Log = Log()

    yield logger

@pytest.fixture
def database(tmp_path: Path):
    db: str = "tmp_db.sqlite"
    db_path: Path = tmp_path / db

    yield Database(db_path)