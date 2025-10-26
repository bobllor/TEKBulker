from pathlib import Path
from api.api import API
from tests.fixtures import api, df
from typing import Any
from core.parser import Parser
from support.vars import DEFAULT_HEADER_MAP
from core.azure_writer import AzureWriter
from io import BytesIO
import pandas as pd
import support.utils as utils
import tests.utils as ttils

def test_generate_csv(tmp_path: Path, api: API, df: pd.DataFrame):
    # creating a baseline dataframe for comparison in the end
    parser: Parser = Parser(df)

    parser.apply(DEFAULT_HEADER_MAP["name"], func=utils.format_name)
    parser.apply(
        DEFAULT_HEADER_MAP["opco"], func=ttils.randomizer, 
        args=("company one", "company two", "company three", "random")
    )
    
    opcos: list[str] = parser.get_rows(DEFAULT_HEADER_MAP["opco"])
    opco_map: dict[str, str] = api.opco.get_content()
    names: list[str] = parser.get_rows(DEFAULT_HEADER_MAP["name"])

    usernames: list[str] = utils.generate_usernames(names, opcos, opco_map)

    df = parser.get_df()
    api.set_output_dir(tmp_path)

    res: dict[str, Any] = api.generate_azure_csv(df)

    if res["status"] == "error":
        raise AssertionError("Failed to generate CSV")

    file: Path = None
    for path in tmp_path.iterdir():
        if "csv" in path.name:
            file = path
    
    if file is None:
        raise AssertionError("Failed to generate CSV")

    csv_bytes: BytesIO = ttils.get_bytesio(file) 
    new_df: pd.DataFrame = pd.read_csv(csv_bytes)

    created_usernames: set[str] = {val for val in new_df["username"].to_dict().values()}

    for username in usernames:
        if username not in created_usernames:
            raise AssertionError(f"Username {username} not found, CSV generation failed")

def test_manual_generate_csv(tmp_path: Path, api: API, df: pd.DataFrame):
    api.set_output_dir(tmp_path)
    parser: Parser = Parser(df)

    names: list[str] = parser.get_rows("full name")
    opcos: list[str] = [
        ttils.randomizer("", "company one", "company two", "company three", "random")
        for _ in range(len(names))
    ]

    usernames: list[str] = utils.generate_usernames(names, opcos, api.opco.get_content())

    manual_content: list[dict[str, str]] = []

    for i, name in enumerate(names):
        opco: str = opcos[i]

        content_dict: dict[str, str] = {}
        content_dict["name"] = name
        content_dict["opco"] = opco

        manual_content.append(content_dict)

    api.generate_manual_csv(manual_content) 

    file: Path = None
    for path in tmp_path.iterdir():
        if "csv" in path.name:
            file = path
    
    if file is None:
        raise AssertionError("Failed to generate CSV")

    csv_bytes: BytesIO = ttils.get_bytesio(file) 
    new_df: pd.DataFrame = pd.read_csv(csv_bytes)

    created_usernames: set[str] = {val for val in new_df["username"].to_dict().values()}

    for username in usernames:
        if username not in created_usernames:
            raise AssertionError(f"Username {username} not found, CSV generation failed")

def test_get_value(api: API):
    excel_val: Any = api.get_reader_value("name", "excel")
    settings_val: Any = api.get_reader_value("output_dir", "settings")
    opco_val: Any = api.get_reader_value("company one", "opco")

    for val in [excel_val, settings_val, opco_val]:
        if val == "":
            raise AssertionError("Got empty key")
    
    fail_val: Any = api.get_reader_value("non", "settings")

    if fail_val != "": raise AssertionError(f"Got value when expecting an empty string")