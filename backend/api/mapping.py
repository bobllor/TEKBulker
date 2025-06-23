from db.database import Database
from typing import Any, Literal
from support.vars import DEFAULT_OPCO_MAP, DEFAULT_HEADER_MAP

class Mapping:
    def __init__(self, db: Database):
        self.db: Database = db

        self._table: str = 'mapping'
        self._columns = ['key, value']

        self._categories: dict[str, str] = {
            'headers': 'headers',
            'opco': 'opco'
        }
    
    def modify_data(self, data: Any) -> dict[str, str]:
        '''Modifies data of a given key in the map.'''
    
    def get_table_data(self, category: str) -> dict[str, str]:
        '''Returns a given mapping in a form of a dictionary.'''
        res: list[Any] = self._get_data(where=f'category="{category}"')
        
        return {key: value for key, value in res}
    
    def get_default_data(self, *, map_type: Literal['headers', 'opco']) -> dict[str, str]:
        '''Returns the default values of the mapping data.'''
        default_data: dict[str, str] = DEFAULT_HEADER_MAP if map_type == 'headers' else DEFAULT_OPCO_MAP

        data: dict[str, str] = {}

        for key in default_data:
            # list will always be length 1 containing a single tuple
            res: list[Any] = self._get_data(where=f'key="{key}"')
            column_key, column_value = res[0]

            data[column_key] = column_value
        
        return data
    
    def _get_data(self, *, where: str ='') -> list[Any]:
        '''Retrieves the given data from the database.
        
        It returns the columns key and value of the table.
        '''
        res: list[Any] = self.db.select(table=self._table, 
            columns=self._columns, where=where)
        
        return res