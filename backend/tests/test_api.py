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
    writer: AzureWriter = AzureWriter()
    writer.set_usernames(
        parser.get_rows(DEFAULT_HEADER_MAP["name"]), 
        opcos=parser.get_rows(DEFAULT_HEADER_MAP["opco"]),
        opco_map=api.opco.get_content()
    )

    usernames: list[str] = writer.get_data("username")

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

    csv_bytes: BytesIO = ttils.get_csv_bytesio(file) 
    new_df: pd.DataFrame = pd.read_csv(csv_bytes)

    created_usernames: set[str] = {val for val in new_df["username"].to_dict().values()}

    for username in usernames:
        if username not in created_usernames:
            raise AssertionError(f"Username {username} not found, CSV generation failed")