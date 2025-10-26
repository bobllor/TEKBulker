from logger import Log
from pathlib import Path
from core.json_reader import Reader
from api.api import API
from support.vars import DEFAULT_HEADER_MAP, DEFAULT_SETTINGS_MAP, DEFAULT_OPCO_MAP
import pandas as pd
import pytest

JSON: Path = Path(__file__).parent / "data.json"

@pytest.fixture
def logger():
    logger: Log = Log()

    yield logger

@pytest.fixture
def reader(tmp_path: Path):
    json_name: str = "temp_reader.json"
    json_path: Path = tmp_path / "cfg" / json_name

    yield Reader(json_path, defaults=DEFAULT_HEADER_MAP, is_test=True)

@pytest.fixture
def api(tmp_path: Path):
    config_path: Path = tmp_path / "config"

    excel: Reader = Reader(config_path / "excel.json", defaults=DEFAULT_HEADER_MAP, is_test=True)
    settings: Reader = Reader(config_path / "settings.json", defaults=DEFAULT_SETTINGS_MAP, is_test=True)
    opcos: Reader = Reader(config_path / "opcos.json", defaults=DEFAULT_OPCO_MAP, is_test=True)

    opco_map: dict[str, str] = {
        "default": DEFAULT_OPCO_MAP["default"],
        "company one": "company.one.org",
        "company two": "companytwo.com",
        "company three": "company.three.nhs.gov"
    }

    opcos.insert_many(opco_map)

    api: API = API(excel_reader=excel, settings_reader=settings, opco_reader=opcos)
    api.set_output_dir(tmp_path)

    yield api

@pytest.fixture
def df():
    df: pd.DataFrame = pd.read_json(JSON)

    df = df.rename(mapper=lambda x: x.lower(), axis=1)

    yield df