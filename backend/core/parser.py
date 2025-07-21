import pandas as pd
import support.utils as util
from base64 import b64decode
from io import BytesIO
from support.vars import AZURE_HEADERS, AZURE_VERSION

class Parser:
    def __init__(self, b64_string: str):
        '''Class used to modify, validate, and parse an Excel file.
        
        Parameters
        ----------
            b64_string: str
                A Base64 string, this will get decoded into bytes for *pandas* to read.
        '''
        decoded_data: bytes = b64decode(b64_string)
        in_mem_bytes: BytesIO = BytesIO(decoded_data)

        # at the moment excel only. CSVs could work because of the amount of columns
        # that can appear in a file, maybe.
        self.df: pd.DataFrame = pd.read_excel(in_mem_bytes)

        # lower all column names.
        self.df.rename(mapper=lambda x: x.lower(), axis=1, inplace=True)

    def validate_df(self, *, default_headers: dict[str, str], default_opco: str = 'staffing') -> dict[str, str]:
        '''Validate the DataFrame.
        
        Parameters
        ----------
            default_headers: dict[str, str]
                Dictionary that maps internal variable names to user-defined names. The keys
                are the internal names, the values are user-defined names. Used to validate
                column headers.
            
            default_opco: str, staffing
                The default operating company to fall back on if the column contains empty values.
        '''
        res: dict[str, str] = self._check_df_columns(default_headers)

        if res.get('status', 'error') == 'error':
            return res
        
        # used for column names (user defined)
        full_name: str = default_headers.get('name')
        opco: str = default_headers.get('opco')

        self.df[full_name] = self.df[full_name].apply(func=util.validate_name)
        self.df[opco].fillna(default_opco, inplace=True)

        # drop any rows with empty name values. should be rare...
        bad_rows: list[int] = self._find_bad_names(self.df[full_name].to_list())
        
        self.df.drop(index=bad_rows, axis=0, inplace=True)

        return res
    
    def get_names(self, *, col_name: str) -> list[str]:
        '''Get a list of names from the DataFrame.
        
        Parameters
        ----------
            col_name: str
                The column name of the DataFrame that represents the names column.
        '''
        # the names are validated and corrected in validate_df.
        return self.df[col_name].to_list()

    def get_usernames(self, *, names: list[str], opco_map: dict[str, str]) -> list[str]:
        '''Get a list of usernames from a list of names.'''
        usernames: list[str] = []

        for name in names:
            username: str = util.generate_username(
                name, func=lambda x: x.replace(' ', '.').strip(), opco_map=opco_map
            )

            usernames.append(username)

        return usernames
    
    def get_passwords(self, *, max_length: int = 20) -> list[str]:
        '''Generates random passwords for each user in the row.'''
        passwords: list[str] = []

        for _ in range(len(self.df)):
            passwords.append(util.generate_password(max_length))

        return passwords
    
    def _find_bad_names(self, names: list[str]) -> list[int]:
        '''Returns a list of integers indicating what row number a bad name value is found.'''
        numbers: list[int] = []

        for i, name in enumerate(names):
            if not isinstance(name, str):
                numbers.append(i)

        return numbers

    def _check_df_columns(self, column_map: dict[str, str]) -> dict[str, str]:
        '''Checks the DataFrame columns to the reversed column map.'''
        # reverse to check the user defined names
        rev_column_map: dict = {v: k for k, v in column_map.items()}

        found: list[str] = []

        for col in self.df.columns:
            low_col: str = col.lower()

            if len(found) == len(rev_column_map):
                break

            if low_col in rev_column_map:
                found.append(low_col)
            
        if len(found) != len(rev_column_map):
            return util.generate_response(status='error', message='')

        return util.generate_response(status='success')