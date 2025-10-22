from db.database import Database
from typing import Any, Literal
from support.vars import DEFAULT_OPCO_MAP, DEFAULT_HEADER_MAP

class Mapping:
    def __init__(self, db: Database):
        self.db: Database = db

        self._table: Literal["mapping"] = 'mapping'
        self._columns = ['key, value']

        self._categories: dict[str, str] = {
            'headers': 'headers',
            'opco': 'opco',
            'template': 'template'
        }
    
    def get_table_data(self, category: Literal['headers', 'opco', 'template']) -> dict[str, str]:
        '''Returns a given mapping in a form of a dictionary.'''
        res: list[Any] = self._get_data(where=f'category="{category}"')
        
        return {key: value for key, value in res}
    
    def get_default_data(self, *, map_type: Literal['headers', 'opco', 'template']) -> dict[str, str]:
        '''Returns the default values of the mapping data.'''
        default_data: dict[str, str] = DEFAULT_HEADER_MAP if map_type == 'headers' else DEFAULT_OPCO_MAP

        data: dict[str, str] = {}

        for key in default_data:
            # list will always be length 1 containing a single tuple
            res: list[Any] = self._get_data(where=f'key="{key}"')
            column_key, column_value = res[0]

            data[column_key] = column_value
        
        return data
    
    def add_row(self, category: Literal["headers", "opco", "template"], columns: list[str]) -> None:
        '''Add a row to the table.
        
        Parameters
        ----------
            category: str, Literal["headers", "opco", "template"]
                The category the row belongs to.
            
            columns: list[str]
        '''

        self.db.insert(table=self._table)
    
    def update_data(self, *, set_sql: str, where: str) -> dict[str, str]:
        '''Modifies the column of a given row in the database.
        
        Parameters
        ----------
            set_sql: str
                The SQL command in string form. Example: "SET column='value',...".
            
            where: str
                The SQL command to filter out the rows. Example: "WHERE column='value',..."
        '''
        self.db.update(table=self._table, set_=set_sql, where=where)
    
    def _get_data(self, *, where: str ='') -> list[Any]:
        '''Retrieves the given data from the database.
        
        It always returns a list of tuples containing the columns key and value of the table.
        '''
        res: list[Any] = self.db.select(table=self._table, 
            columns=self._columns, where=where)
        
        return res