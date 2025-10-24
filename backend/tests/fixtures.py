from logger import Log
from pathlib import Path
from core.json_reader import Reader
from support.vars import DEFAULT_HEADER_MAP
import pytest

@pytest.fixture
def logger():
    logger: Log = Log()

    yield logger

@pytest.fixture
def reader(tmp_path: Path):
    json_name: str = "temp_reader.json"
    json_path: Path = tmp_path / "cfg" / json_name

    yield Reader(json_path, defaults=DEFAULT_HEADER_MAP, is_test=True)