from pathlib import Path
from api.api import API
from tests.fixtures import api, df
from typing import Any
from core.parser import Parser
from support.vars import DEFAULT_HEADER_MAP
from support.types import ManualCSVProps
from core.azure_writer import AzureWriter
from io import BytesIO
import pandas as pd
import support.utils as utils
import tests.utils as ttils
import random

def test_generate_csv(tmp_path: Path, api: API, df: pd.DataFrame):
    # creating a baseline dataframe for comparison in the end
    parser: Parser = Parser(df)

    parser.apply(
        DEFAULT_HEADER_MAP["opco"], func=ttils.randomizer, 
        args=("company one", "company two", "company three", "random")
    )
    
    opcos: list[str] = parser.get_rows(DEFAULT_HEADER_MAP["opco"])
    opco_map: dict[str, str] = api.opco.get_content()
    names: list[str] = parser.get_rows(DEFAULT_HEADER_MAP["name"])

    usernames: list[str] = utils.generate_usernames(names, opcos, opco_map)

    df = parser.get_df()

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

def test_generate_csv_dupe_names(tmp_path: Path, api: API, df: pd.DataFrame):
    dupe_name: str = "John Doe"
    
    df[DEFAULT_HEADER_MAP["name"]] = df[DEFAULT_HEADER_MAP["name"]].apply(
        func=lambda x: x if random.randint(0, 1) == 0 else dupe_name
    )

    names: list[str] = df[DEFAULT_HEADER_MAP["name"]].to_list()

    api.generate_azure_csv(df)

    file: Path = None
    for path in tmp_path.iterdir():
        if "csv" in path.name:
            file = path
    
    if file is None:
        raise AssertionError("Failed to generate CSV")

    csv_bytes: BytesIO = ttils.get_bytesio(file) 
    new_df: pd.DataFrame = pd.read_csv(csv_bytes)

    dupe_count: int = 0
    for username in new_df["username"].to_list():
        username: str = username.replace(".", " ")
        base_name: str = dupe_name

        if base_name in username:
            if dupe_count != 0:
                base_name += str(dupe_count)

            if base_name not in username:
                raise AssertionError(f"Expected {base_name} in {username}")

            dupe_count += 1
    
    for i, name in enumerate(new_df["name"].to_list()):
        if names[i] != name:
            raise AssertionError(f"Name {name} does not match base name {names[i]}") 

def test_manual_generate_csv(tmp_path: Path, api: API, df: pd.DataFrame):
    parser: Parser = Parser(df)

    names: list[str] = parser.get_rows("full name")
    opcos: list[str] = [
        ttils.randomizer("", "company one", "company two", "company three", "random")
        for _ in range(len(names))
    ]

    usernames: list[str] = utils.generate_usernames(names, opcos, api.opco.get_content())

    manual_content: list[ManualCSVProps] = []

    for i, name in enumerate(names):
        opco: str = opcos[i]

        content_dict: ManualCSVProps = {}
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

def test_manual_generate_csv_dupe_names(tmp_path: Path, api: API, df: pd.DataFrame):
    dupe_name: str = "John Doe"
    names: list[str] = df[DEFAULT_HEADER_MAP["name"]].to_list()
    opcos: list[str] = df[DEFAULT_HEADER_MAP["opco"]].to_list()

    for i in range(len(names)):
        random_val: int = random.randint(0, 1)
        names[i] = names[i] if random_val == 0 else dupe_name

    manual_content: list[ManualCSVProps] = []

    for i, name in enumerate(names):
        opco: str = opcos[i]

        content: ManualCSVProps = {}
        content["name"] = name
        content["opco"] = opco

        manual_content.append(content)
    
    api.generate_manual_csv(manual_content)

    file: Path = None
    for path in tmp_path.iterdir():
        if "csv" in path.name:
            file = path
    
    if file is None:
        raise AssertionError("Failed to generate CSV")

    csv_bytes: BytesIO = ttils.get_bytesio(file) 
    new_df: pd.DataFrame = pd.read_csv(csv_bytes)

    dupe_count: int = 0
    for username in new_df["username"].to_list():
        username: str = username.replace(".", " ")
        base_name: str = dupe_name

        if base_name in username:
            if dupe_count != 0:
                base_name += str(dupe_count)

            if base_name not in username:
                raise AssertionError(f"Expected {base_name} in {username}")

            dupe_count += 1

    for i, name in enumerate(new_df["name"].to_list()):
        if names[i] != name:
            raise AssertionError(f"Name {name} does not match base name {names[i]}") 

def test_get_value(api: API):
    excel_val: Any = api.get_reader_value("excel", "name")
    settings_val: Any = api.get_reader_value("settings", "output_dir")
    opco_val: Any = api.get_reader_value("opco", "company one")

    for val in [excel_val, settings_val, opco_val]:
        if val == "":
            raise AssertionError("Got empty key")
    
    fail_val: Any = api.get_reader_value("settings", "non")

    if fail_val != "": raise AssertionError(f"Got value when expecting an empty string")

def test_update_key(api: API):
    prev_val: str = api.get_reader_value("excel", "name")
    
    var: str = "CHANGED VALUE"
    res: dict[str, Any] = api.update_key("excel", "name", var)

    if res["status"] == "error":
        raise AssertionError(f"Failed to update key: {res}")
    
    new_val: str = api.get_reader_value("excel", "name")

    assert prev_val != new_val and new_val == var

def test_update_default_key(api: API):
    prev_val: str = api.get_reader_value("opco", "default")

    var: str = "NEW DEFAULT"
    res: dict[str, Any] = api.update_key("opco", "default", var)

    new_val: str = api.get_reader_value("opco", "default")

    assert res["status"] != "error" and prev_val != new_val and new_val == var

def test_insert_update_rm_many(api: API):
    data: dict[str, str] = {
        "default": "5555",
        "company one": "t444",
        "company two": "123",
        "inserted key": "11",
    }

    print(api.get_reader_content("opco"))
    api.insert_update_rm_many("opco", data)

    new_data: dict[str, str] = api.get_reader_content("opco")

    # company three should be removed as it does not exist in data.
    # inserted key is inserted. 
    assert "company three" not in new_data and "inserted key" in new_data

def test_get_content(api: API):
    data: dict[str, Any] = api.get_reader_content("opco")

    assert data == api.opco.get_content()

def test_initialization(api: API):
    content: dict[str, dict[str, Any]] = api.initialization()

    assert len(content) != 0