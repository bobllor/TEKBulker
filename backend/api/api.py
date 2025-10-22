from db.database import Database
from .settings import Settings
from .mapping import Mapping
from core.parser import Parser
from core.azure_writer import AzureWriter
from support.types import GenerateCSVProps
from base64 import b64decode
from io import BytesIO
from logger import Log
from pathlib import Path
import support.utils as utils
import pandas as pd

class API:
    def __init__(self, db: Database, *, logger: Log = None):
        self.settings: Settings = Settings(db)
        self.mapping: Mapping = Mapping(db)
        self.logger: Log = logger or Log()

    def generate_azure_csv(self, content: list[GenerateCSVProps]) -> dict[str, str]: 
        '''Generates the Azure CSV file for bulk accounts.
        
        Parameters
        ----------
            content: list[GenerateCSVProps]
                List of dictionaries that contains the keys `fileName` and `b64`. 
        '''
        # TODO: the loop will be called in the frontend with singel file.
        # i have an idea with the UI/UX and that is to give a status on each entry graphic.
        # this is a separate function, i am not using this one.
        for ele in content:
            delimited: list[str] = ele['b64'].split(',')
            file_name: str = ele['fileName']

            # could add csv support here, for now it will be excel.
            # NOTE: this could be useless because my front end already has this check.
            if('spreadsheet' not in delimited[0].lower()):
                return utils.generate_response(message='Incorrect file entered, got file TYPE_HERE')

            b64_string: str = delimited[-1]

            decoded_data: bytes = b64decode(b64_string)
            in_mem_bytes: BytesIO = BytesIO(decoded_data)
            df: pd.DataFrame = pd.read_excel(in_mem_bytes)

            parser: Parser = Parser(df)
            
            default_headers: dict[str, str] = self.mapping.get_default_data(map_type='headers')
            default_opco: dict[str, str] = self.mapping.get_default_data(map_type='opco')

            parser.apply(default_headers["name"], utils.format_name)
            validate_dict: dict[str, str] = parser.validate_headers(
                default_headers=default_headers
            )

            if validate_dict.get('status', 'error') == 'error':
                return utils.generate_response(status='error', message=f'Invalid file \
                    {file_name} uploaded.')

            names: list[str] = parser.get_rows(default_headers['name']) 
            opcos: list[str] = parser.get_rows(default_opco["opco"])

            opco_map: dict[str, str] = self.mapping.get_table_data("opco")

            writer: AzureWriter = AzureWriter(logger=self.logger)

            writer.set_full_names(names)
            writer.set_names(names)
            writer.set_block_sign_in(len(names), []) 
            writer.set_usernames(names, opcos=opcos, opco_map=opco_map)
            writer.set_passwords([utils.generate_password(20) for _ in range(len(names))])

            csv_name: str = f"{utils.get_date()}-az-bulk.csv"
            writer.write(Path(self.get_output_dir()) / csv_name)

        return utils.generate_response(status='success', message=f'')
    
    def generate_manual_csv(self, content: list[dict[str, str]]) -> dict[str, str]:
        '''Generates the Azure CSV file for bulk accounts through the manual input.'''
        names: list[str] = []
        opcos: list[str] = []

        seen_names: dict[str, int] = {}

        # contains name, opco, and id. id is not relevant to this however.
        # i could also possibly add in the block sign in values in the content...
        for obj in content:
            name: str = utils.format_name(obj['name'])
            names.append(name)

            # assume duplicate names are unique, a number is added to distinguish the username.
            if name not in seen_names:
                seen_names[name] = 0
            else:
                seen_names[name] = seen_names.get(name) + 1

                name = name + str(seen_names.get(name))

            opcos.append(obj["opco"])
        

        passwords: list[str] = [utils.generate_password() for _ in range(len(names))]
        opco_map: dict[str, str] = self.mapping.get_table_data("opco")
        writer: AzureWriter = AzureWriter(logger=self.logger)

        writer.set_full_names(names)
        writer.set_usernames(names, opcos=opcos, opco_map=opco_map)
        writer.set_passwords(passwords)
        writer.set_block_sign_in(len(names), [])
        writer.set_names(names)

        csv_name: str = f"{utils.get_date()}-az-bulk.csv"
        writer.write(Path(self.get_output_dir()) / csv_name)

        return utils.generate_response(status='success', message='')

    def get_output_dir(self) -> str:
        '''Retrieve the output directory.'''
        key: str = 'output_dir'

        return self.settings.get_setting(key)
    
    def update_output_dir(self) -> dict[str, str]:
        '''Update the output directory.'''
        from tkinter.filedialog import askdirectory

        new_dir: str = askdirectory()
    
        if new_dir == '':
            return
        
        set_sql: str = f'value = "{new_dir}"'
        where: str = f'key = "output_dir"'

        self.settings.update_setting(set_sql=set_sql, where=where)