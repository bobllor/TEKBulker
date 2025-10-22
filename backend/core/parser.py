import pandas as pd
import support.utils as util
from typing import Any, Callable, overload, Literal
from support.vars import AZURE_HEADERS, AZURE_VERSION

class Parser:
    def __init__(self, df: pd.DataFrame):
        '''Class used to modify, validate, and parse an Excel file.
        
        Parameters
        ----------
            df: pd.DataFrame
                The DataFrame, Parser creates a deep copy of the given DataFrame.
        '''
        self.df: pd.DataFrame = df.copy(deep=True)

        # lower all column names.
        self.df.rename(mapper=lambda x: x.lower(), axis=1, inplace=True)

    def validate_headers(self, default_headers: dict[str, str]) -> dict[str, str]:
        '''Validate the headers of the DataFrame.
        
        Parameters
        ----------
            default_headers: dict[str, str]
                Dictionary that maps internal variable names to user-defined names. The keys
                are the internal names, the values are user-defined names. Used to validate
                column headers.
        '''
        res: dict[str, str] = self._check_df_columns(default_headers)

        if res.get('status', 'error') == 'error':
            return res

        return res
    
    def fillna(self, column: str, value: Any) -> None:
        '''Replaces all NaN values on a target column with a value in place.'''
        column = column.lower()
        self.df[column] = self.df[column].fillna(value)
    
    def drop_empty_rows(self, col_name: str) -> None:
        '''Drop rows if a row is empty or NaN based on rows from a given column name. 
        The DataFrame is modified in place.
        '''
        bad_rows: list[int] = []

        for i, data in enumerate(self.get_rows(col_name)):
            if not isinstance(data, str):
                bad_rows.append(i)
        
        self.df.drop(index=bad_rows, axis=0, inplace=True)
    
    def apply(self, col_name: str, *, func: Callable[[Any], Any]) -> None:
        '''Applies a function onto a column and replaces the column values in the DataFrame
        in place.

        Parameters
        ----------
            col_name: str
                The column name of the DataFrame.

            func: Callable
                A callable function, it must take one argument and returns one argument. 
        '''
        col_name = col_name.lower()
        self.df[col_name] = self.df[col_name].apply(func=func)
    
    def get_columns(self) -> list[str]:
        '''Returns a list of column names.'''
        return self.df.columns.to_list()
    
    def get_rows(self, col_name: str) -> list[Any]:
        '''Get rows from a DataFrame column in the form of a list.
        
        Parameters
        ----------
            col_name: str
                The column name of the DataFrame that represents the names column.
                It is not case sensitive.
        '''
        # the names are validated and corrected in validate_df.
        return self.df[col_name.lower()].to_list()

    def get_usernames(self, *, names: list[str], opco_map: dict[str, str]) -> list[str]:
        '''Get a list of usernames from a list of names.
        
        Parameters
        ----------
            names: list[str]
                The list of names.
            
            opco_map: dict[str, str]
                Mappings of operating companies as the key and their custom domain names as the values.
        '''
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