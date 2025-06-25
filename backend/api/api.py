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
        
        default_headers: dict[str, str] = self.mapping.get_default_data(map_type='headers')
        default_opco: dict[str, str] = self.mapping.get_default_data(map_type='opco')

        parser.validate_df(default_headers=default_headers, default_opco=default_opco)

        # woah.
        names: list[str] = parser.get_names(col_name=default_headers['name'])
        usernames: list[str] = parser.get_usernames(names=names, opco_map=self.mapping.get_table_data('opco'))
        passwords: list[str] = parser.get_passwords()
        countries: list[str] = parser.df[default_headers.get('country')].to_list()

        parser.generate_csv(names=names, usernames=usernames, passwords=passwords,
            file_path=self.get_output_dir(), countries=countries)

        return generate_response(status='success', message='')

    def get_output_dir(self) -> str:
        '''Retrieve the output directory.
        
        Parameters
        ----------
            setting_key: str
                The name of a setting, this is defined in the default settings dictionary.
        '''
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