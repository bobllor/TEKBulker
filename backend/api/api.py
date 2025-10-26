from core.json_reader import Reader
from core.parser import Parser
from core.azure_writer import AzureWriter
from support.types import GenerateCSVProps, ManualCSVProps
from base64 import b64decode
from io import BytesIO
from logger import Log
from pathlib import Path
from typing import Any, Literal
from support.vars import DEFAULT_HEADER_MAP, DEFAULT_OPCO_MAP, DEFAULT_SETTINGS_MAP
import support.utils as utils
import pandas as pd

class API:
    def __init__(self, *, 
            excel_reader: Reader, settings_reader: Reader,
            opco_reader: Reader, logger: Log = None
        ):
        '''API class.
        
        Parameters
        ----------
            excel_reader: Reader
                The Reader used for the Excel columns for reading and parsing files.
            
            settings_reader: Reader
                The Reader used for handling program settings.

            opco_reader: Reader
                The Reader used for handling operating company-domain name key-value mapping.
            
            logger: Log, default None
                The logger, if None is given then it will be a default logger.
        '''
        self.excel: Reader = excel_reader
        self.settings: Reader = settings_reader
        self.opco: Reader = opco_reader
        self.logger: Log = logger or Log()

    def initialization(self) -> dict[str, dict[str, Any]]:
        '''Returns all Reader values in one dictionary.'''
        contents: dict[str, Any] = {
            "excelColumns": self.excel.get_content(),
            "settings": self.settings.get_content(),
            "opco": self.opco.get_content(),
        }

        self.logger.debug(f"Data {contents} initializing")

        return contents

    def generate_azure_csv(self, content: GenerateCSVProps | pd.DataFrame) -> dict[str, str]: 
        '''Generates the Azure CSV file for bulk accounts.
        
        Parameters
        ----------
            content: GenerateCSVProps
                A dictionary containing the content to read and parse the Excel file. 
        '''
        df: pd.DataFrame = None
        if isinstance(content, dict):
            delimited: list[str] = content['b64'].split(',')
            file_name: str = content['fileName']

            # could add csv support here, for now it will be excel.
            # NOTE: this could be useless because my front end already has this check.
            if 'spreadsheet' not in delimited[0].lower():
                return utils.generate_response(status="error", 
                    message='Incorrect file entered, got file TYPE_HERE'
                )

            b64_string: str = delimited[-1]
            decoded_data: bytes = b64decode(b64_string)
            in_mem_bytes: BytesIO = BytesIO(decoded_data)

            df = pd.read_excel(in_mem_bytes)
        else:
            df = content

        parser: Parser = Parser(df)
        
        # the user defined headers (values).
        # the key is the internal name, the value is the user defined columns.
        # however there is only three required keys: name, opco, and country.
        default_excel_columns: dict[str, str] = self.excel.get_content()

        validate_dict: dict[str, str] = parser.validate_headers(
            default_headers=default_excel_columns
        )

        if validate_dict.get('status', 'error') == 'error':
            return utils.generate_response(status='error', message=f'Invalid file \
                {file_name} uploaded.')

        parser.apply(default_excel_columns["name"], func=utils.format_name)
        names: list[str] = parser.get_rows(default_excel_columns['name']) 
        opcos: list[str] = parser.get_rows(default_excel_columns["opco"])

        dupe_names: list[str] = utils.check_duplicate_names(names)

        # the mapping of the operating company to their domain name.
        opco_mappings: dict[str, str] = self.opco.get_content()
        # TODO: add formatting style/case/type
        usernames: list[str] = utils.generate_usernames(dupe_names, opcos, opco_mappings)

        writer: AzureWriter = AzureWriter(logger=self.logger)

        writer.set_full_names(names)
        writer.set_names(names)
        writer.set_block_sign_in(len(names), []) 
        writer.set_usernames(usernames)
        writer.set_passwords([utils.generate_password(20) for _ in range(len(names))])

        csv_name: str = f"{utils.get_date()}-az-bulk.csv"
        writer.write(Path(self.get_reader_value("output_dir", "settings")) / csv_name)

        self.logger.info(f"Generated {csv_name} at {self.get_reader_value('output_dir', 'settings')}")

        return utils.generate_response(
            status='success', 
            message=f'Generated CSV file',
            status_code=200
        )
    
    def generate_manual_csv(self, content: list[ManualCSVProps]) -> dict[str, str]:
        '''Generates the Azure CSV file for bulk accounts through the manual input.
        
        Parameters
        ----------
            content: list[ManualCSVProps]
                A list of dictionaries to convert into a DataFrame for a CSV.
                Each dictionary represents a row to be added.
        '''
        names: list[str] = []
        opcos: list[str] = []

        opco_mappings: dict[str, str] = self.opco.get_content()

        # contains name, opco, and id. id is not relevant to this however.
        # i could also possibly add in the block sign in values in the content...
        for obj in content:
            name: str = utils.format_name(obj["name"])
            opco: str = obj["opco"]

            names.append(name)
            opcos.append(opco)
        
        dupe_names: list[str] = utils.check_duplicate_names(names)

        # TODO: add formatting style/case/type
        usernames: list[str] = utils.generate_usernames(dupe_names, opcos, opco_mappings)
        passwords: list[str] = [utils.generate_password() for _ in range(len(names))]

        writer: AzureWriter = AzureWriter(logger=self.logger)

        writer.set_full_names(names)
        writer.set_usernames(usernames)
        writer.set_passwords(passwords)
        writer.set_block_sign_in(len(names), [])
        writer.set_names(names)

        csv_name: str = f"{utils.get_date()}-az-bulk.csv"
        writer.write(Path(self.get_reader_value("output_dir", "settings")) / csv_name)

        self.logger.info(f"Manual generated {csv_name} at {self.get_reader_value('output_dir', 'settings')}")

        return utils.generate_response(status='success', message='', status_code=200)
    
    def get_reader_value(self, key: str, reader: Literal["settings", "opco", "excel"]) -> Any:
        '''Gets the values from any Reader keys. If the key does not exist,
        then an empty string is returned.'''
        readers: dict[str, Reader] = {
            "settings": self.settings,
            "opco": self.opco,
            "excel": self.excel,
        }

        val: Any = readers[reader].get(key)

        if val is None:
            self.logger.error(f"Key {key} does not exist in {reader}")
            return ""
        
        return val
    
    def set_output_dir(self, dir_: Path | str = None) -> dict[str, str]:
        '''Update the output directory.'''
        from tkinter.filedialog import askdirectory
        
        new_dir: str = ""
        if dir_ is None:
            new_dir = askdirectory()
        else:
            new_dir = str(dir_)

        if new_dir == "":
            return

        self.settings.update("output_dir", new_dir)