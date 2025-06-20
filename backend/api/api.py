from db.database import Database
from .settings import Settings
from .mapping import Mapping
from core.parser import Parser
from support.utils import generate_response
from typing import Literal

class API:
    def __init__(self, *, db: Database):
        self.settings: Settings = Settings(db)
        self.mapping: Mapping = Mapping(db)

    def generate_azure_csv(self, content: str) -> dict[str, str]:
        '''Generates the Azure CSV file for bulk accounts.'''
        delimited: list[str] = content.split(',')

        # could add csv support here, for now it will be excel.
        # NOTE: this could be useless because my front end already has this check.
        if('spreadsheet' not in delimited[0].lower()):
            return generate_response(message='Incorrect file entered, got file TYPE_HERE')

        b64_string: str = delimited[-1]

        parser: Parser = Parser(b64_string)
        
        # TODO: generate the azure csv.

        return generate_response(status='success', message='')

    def get_table_data(self, category: Literal['opco', 'headers']) -> dict[str, str]:
        '''Retrieve all key-value pairs from a given category.
        
        Parameters
        ----------
            category: str
                The category of mapping data, this is either 'opco' or 'headers'.
        '''
        return self.mapping.get_table_data(category)
    
    def get_output_dir(self) -> str:
        '''Retrieve a value from a given setting key.
        
        Parameters
        ----------
            setting_key: str
                The name of a setting, this is defined in the default settings dictionary.
        '''
        key: str = 'output_dir'

        return self.settings.get_setting(key)