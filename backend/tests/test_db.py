from pathlib import Path
from db.database import Database
from typing import TypedDict, Any
from tests.fixtures import database
from support.vars import DEFAULT_HEADER_MAP, DEFAULT_OPCO_MAP, DEFAULT_TEMPLATE_MAP, DEFAULT_SETTINGS_MAP

class Tables(TypedDict):
    maps: str
    settings: str

TABLES: Tables ={
    "maps": "mapping",
    "settings": "settings"
}

def test_db_missing_defaults(database: Database):
    maps_list: list[Any] = database.get_all_rows(TABLES["maps"])
    settings_list: list[Any] = database.get_all_rows(TABLES["settings"])
    flattened_rows: list[str] = [val for _, val, _ in maps_list + settings_list]

    defaults: list[dict[str, str]] = [
        DEFAULT_HEADER_MAP, DEFAULT_SETTINGS_MAP,
        DEFAULT_OPCO_MAP, DEFAULT_TEMPLATE_MAP
    ]
    flattened_defaults: dict[str, str] = {}

    for ele in defaults:
        for key, val in ele.items():
            flattened_defaults[key] = val

    for key in flattened_rows:
        if key not in flattened_defaults:
            raise AssertionError("Missing default %s in database: %s", key, flattened_defaults)