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

        # no dash replacement for spaces, i'll make it user specific.
        self.df.rename(mapper=lambda x: x.lower(), axis=1, inplace=True)

    def generate_csv(self, *, column_map: dict[str, str], opco_map: dict[str, str]) -> None:
        '''Generates the csv file for bulk account creation in Azure.
        
        Parameters
        ----------
            column_map: dict[str, str]
                Dictionary that maps internal variable names to user-defined names. The keys
                are the internal names, the values are user-defined names.

            opco_map: dict[str, str]
                Dictionary that maps operating company names to the domain names.
        '''
        pass

    def validate_df(self, *, column_map: dict[str, str], default_opco: str = 'staffing',
        default_country: str = 'United States') -> dict[str, str]:
        '''Validate the DataFrame.
        
        Parameters
        ----------
            column_map: dict[str, str]
                Dictionary that maps internal variable names to user-defined names. The keys
                are the internal names, the values are user-defined names. Used to validate
                column headers.
            
            default_opco: str, staffing
                The default operating company to fall back on if the column contains empty values.

            default_country: str, default "United States"
                The default country to fall back on if the column contains empty values.
        '''
        res: dict[str, str] = self._check_df_columns(column_map)

        if res.get('status', 'error') == 'error':
            return res
        
        # used for column names (user defined)
        full_name: str = column_map.get('name')
        country: str = column_map.get('country')
        opco: str = column_map.get('opco')

        self.df[full_name] = self.df[full_name].apply(func=util.validate_name)

        self.df[country].fillna(default_country, inplace=True)
        self.df[opco].fillna(default_opco, inplace=True)

        # drop any rows with empty name values. should be rare...
        bad_rows: list[int] = self._find_bad_names(self.df[full_name].to_list())
        
        self.df.drop(index=bad_rows, axis=0, inplace=True)

        return res
    
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

        return util.generate_response(status='success', message='')
