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

    def generate_csv(self, *, 
        names: list[str], 
        usernames: list[str],
        passwords: list[str],
        file_path: str,
        block_sign_in: list[str] = [],
        countries: list[str] = []) -> None:
        '''Generates the csv file for bulk account creation in Azure.
        
        Parameters
        ----------
            names: list[str]
                List of strings that represents the client names.

            usernames: list[str]
                List of strings that represents the usernames for each client. The values
                are obtained from the function generate_username.
            
            passwords: list[str]
                List of strings that represents the passwords for each client. The values
                are obtained from the function generate_password.
            
            file_path: str
                The string path to the output directory for the CSV file.
            
            block_sign_in: list[str], default []
                A list of strings that are either "Yes" or "No", by default it is an empty list.
                If an empty list is passed, not enough values are given, or the values length is less than names length, 
                then every remaining entry will be defaulted to "No".
                
                The list length is equal to the names length.
            
            countries: list[str], default []
                A list of strings that contains the country/location usage of the user.
        '''
        for _ in range(len(names) - len(block_sign_in)):
            # not needed but won't hurt to have defense...?
            block_sign_in.append('No')

        first_names: list[str] = []
        last_names: list[str] = []

        for name in names:
            f_name, l_name = util.generate_name(name)

            first_names.append(f_name)
            last_names.append(l_name)        

        # 7 keys (in order): 
        # name, username, password, block sign in (default no), 
        # first name, last name, location (default US)
        csv_values: list[list[str]] = [
            names, usernames, passwords, block_sign_in,
            first_names, last_names, countries
        ]

        # csv_values and AZURE_HEADERS are the same order. 
        # if you change one, then you must change the order of the other.
        csv_data: dict[str, str] = {}
        for i in range(len(AZURE_HEADERS)):
            csv_data[AZURE_HEADERS[i]] = csv_values[i]

        new_df: pd.DataFrame = pd.DataFrame(csv_data)
        
        file_name: str = f'{util.get_date()}-azure-bulk'
        full_path: str = file_path + f'/{file_name}'

        with open(full_path, 'w') as f:
            f.write(AZURE_VERSION + '\n')

        new_df.to_csv(full_path, mode='a', index=False)

    def validate_df(self, *, default_headers: dict[str, str], default_opco: str = 'staffing',
        default_country: str = 'United States') -> dict[str, str]:
        '''Validate the DataFrame.
        
        Parameters
        ----------
            default_headers: dict[str, str]
                Dictionary that maps internal variable names to user-defined names. The keys
                are the internal names, the values are user-defined names. Used to validate
                column headers.
            
            default_opco: str, staffing
                The default operating company to fall back on if the column contains empty values.

            default_country: str, default "United States"
                The default country to fall back on if the column contains empty values.
        '''
        res: dict[str, str] = self._check_df_columns(default_headers)

        if res.get('status', 'error') == 'error':
            return res
        
        # used for column names (user defined)
        full_name: str = default_headers.get('name')
        country: str = default_headers.get('country')
        opco: str = default_headers.get('opco')

        self.df[full_name] = self.df[full_name].apply(func=util.validate_name)

        self.df[country].fillna(default_country, inplace=True)
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

        return util.generate_response(status='success', message='')
