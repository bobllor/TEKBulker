from pathlib import Path
from typing import Any
from support.vars import DEFAULT_HEADER_MAP, DEFAULT_OPCO_MAP, AZURE_HEADERS, AZURE_VERSION
from core.azure_writer import AzureWriter, HeadersKey
from core.parser import Parser
from faker import Faker
from io import BytesIO
import pandas as pd
import support.utils as utils
import numpy as np
import random

# this is faked and cleaned data, no sensitive leaks.
test_json: Path = Path(__file__).parent / "data.json"

# columns
FULL_NAME: str = "full name"
OPERATING_COMPANY: str = "operating company"
COUNTRY: str = "country/territory"
NUMBER: str = "number"
DESCRIPTION: str = "short description"

def test_read_excel():
    df: pd.DataFrame = pd.read_json(test_json)

    parser: Parser = Parser(df)

    assert len(parser.get_columns()) > 0

def test_get_excel_data():
    df: pd.DataFrame = pd.read_json(test_json)
    parser: Parser = Parser(df)

    assert len(parser.get_rows("full name")) > 0

def test_apply_name():
    df: pd.DataFrame = pd.read_json(test_json)
    parser: Parser = Parser(df)

    # adding fake names to the name columns
    parser.apply(
        col_name=FULL_NAME, 
        func=lambda x: x + " " + " ".join([Faker().last_name() for _ in range(0, random.randint(1, 3))])
    )

    parser.apply(col_name=FULL_NAME, func=utils.format_name)

    for name in parser.get_rows(FULL_NAME):
        name: str = name
        arr: list[str] = name.split()

        if len(arr) != 2:
            raise AssertionError("Name parsing failed got %s", name)
    
    assert True

def test_fill_nan():
    df: pd.DataFrame = pd.read_json(test_json)
    parser: Parser = Parser(df)

    # filling all columns with nan first.
    parser.apply(OPERATING_COMPANY, func=lambda x: np.nan)
    parser.fillna(OPERATING_COMPANY, DEFAULT_HEADER_MAP["opco"])

    for opco in parser.get_rows(DEFAULT_HEADER_MAP["opco"]):
        if opco == np.nan:
            raise AssertionError(f"Failed to fill empty rows for {DEFAULT_HEADER_MAP["opco"]}")

def test_validate_df():
    df: pd.DataFrame = pd.read_json(test_json)
    parser: Parser = Parser(df)

    res: dict[str, Any] = parser.validate_headers(DEFAULT_HEADER_MAP)

    if res["status"] != "success":
        raise AssertionError(
            f"Failed to validate headers, got {parser.get_columns()}, \
            expected values {[val for val in DEFAULT_HEADER_MAP.values()]}", 
        )

def test_write_new_csv(tmp_path: Path):
    df: pd.DataFrame = pd.read_json(test_json)
    parser: Parser = Parser(df)

    res: dict[str, Any] = parser.validate_headers(DEFAULT_HEADER_MAP)

    if res["status"] != "success":
        raise AssertionError(
            f"Failed to validate headers, got {parser.get_columns()}, \
            expected values {[val for val in DEFAULT_HEADER_MAP.values()]}", 
        )

    parser.apply(DEFAULT_HEADER_MAP["name"], func=utils.format_name)
    parser.drop_empty_rows(DEFAULT_HEADER_MAP["name"])
    parser.fillna(DEFAULT_HEADER_MAP["opco"], "Operating Company")

    parser.apply(DEFAULT_HEADER_MAP["opco"], func=randomizer, args=("company one", "company two", "company three", "random"))

    opco_map: dict[str, str] = {
        "default": DEFAULT_OPCO_MAP["default"],
        "company one": "company.one.org",
        "company two": "companytwo.com",
        "company three": "company.three.nhs.gov"
    }

    writer: AzureWriter = AzureWriter()

    names: list[str] = parser.get_rows(DEFAULT_HEADER_MAP["name"])
    passwords: list[str] = [utils.generate_password() for _ in range(len(names))]

    writer.set_full_names(names)
    writer.set_usernames(names, opcos=parser.get_rows(DEFAULT_HEADER_MAP["opco"]), opco_map=opco_map)
    writer.set_passwords(passwords)
    writer.set_block_sign_in(len(names))
    writer.set_names(names)

    writer.write(tmp_path / "out.csv")

    output: Path = tmp_path / "out.csv"

    with open(output, "r") as file:
        content: list[str] = file.readlines()

        # removing the row for parsing
        content = content[1:]
        csv_bytes: bytes = "".join(content).encode()
    
    df: pd.DataFrame = pd.read_csv(BytesIO(csv_bytes))

    for key in HeadersKey.__args__:
        df_data: list[Any] = df[key].to_list()
        base_data: list[str] = writer.get_data(key)

        if not df_data == base_data:
            raise AssertionError(f"Failed to match baseline: {base_data}, got: {df_data}")

def randomizer(_: str, *args) -> str:
    '''Chooses a random element from the given list and returns it.'''
    size: int = len(args)

    return args[random.randint(0, size - 1)]