from pathlib import Path
from typing import Any
from numpy import nan
from support.vars import DEFAULT_HEADER_MAP, DEFAULT_OPCO_MAP, AZURE_HEADERST, AZURE_VERSION
from core.parser import Parser
from faker import Faker
import pandas as pd
import support.utils as utils
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

    parser.apply(col_name=FULL_NAME, func=utils.validate_name)

    for name in parser.get_rows(FULL_NAME):
        name: str = name
        arr: list[str] = name.split()

        if len(arr) != 2:
            raise AssertionError("Name parsing failed got %s", name)
    
    assert True

def test_fill():
    df: pd.DataFrame = pd.read_json(test_json)
    parser: Parser = Parser(df)

    # filling all columns with nan first.
    parser.apply(OPERATING_COMPANY, func=lambda x: nan)
    print(parser.get_rows(OPERATING_COMPANY))

    parser.fillna(OPERATING_COMPANY, DEFAULT_HEADER_MAP["opco"])

    print(parser.get_rows(OPERATING_COMPANY))

def test_validate_df():
    df: pd.DataFrame = pd.read_json(test_json)
    parser: Parser = Parser(df)

    res: dict[str, Any] = parser.validate_headers(DEFAULT_HEADER_MAP)

    if res["status"] != "success":
        raise AssertionError(
            f"Failed to validate headers, got {parser.get_columns()}, \
            expected values {[val for val in DEFAULT_HEADER_MAP.values()]}", 
        )

def test_write_new_df():
    df: pd.DataFrame = pd.read_json(test_json)
    parser: Parser = Parser(df)

    res: dict[str, Any] = parser.validate_headers(DEFAULT_HEADER_MAP)

    parser.apply(DEFAULT_HEADER_MAP["name"], func=utils.format_name)
    parser.drop_empty_rows(DEFAULT_HEADER_MAP["name"])
    parser.fillna(DEFAULT_HEADER_MAP["opco"], "Operating Company")

    names: list[str] = parser.get_rows(DEFAULT_HEADER_MAP["name"])
    usernames: list[str] = parser.get_usernames(
        names=names, opco_map=DEFAULT_OPCO_MAP
    )
    passwords: list[str] = parser.get_passwords()

    first_names: list[str] = []
    last_names: list[str] = []

    for name in names:
        name_list: list[str] = name.split()

        first_names.append(name_list[0])
        last_names.append(name_list[-1])

    csv_data: dict[str, Any] = {
        AZURE_HEADERST["name"]: names,
        AZURE_HEADERST["username"]: usernames,
        AZURE_HEADERST["password"]: passwords,
        AZURE_HEADERST["block_sign_in"]: ["No" for _ in range(len(names))],
        AZURE_HEADERST["first_name"]: first_names,
        AZURE_HEADERST["last_name"]: last_names,
    }

    new_df: pd.DataFrame = pd.DataFrame(csv_data)
    print(new_df)