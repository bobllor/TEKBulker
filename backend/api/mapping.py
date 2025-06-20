from db.database import Database
from typing import Any

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
    
    def _get_data(self, *, where: str ='') -> list[Any]:
        '''Retrieves the given data from the database.'''
        res: list[Any] = self.db.select(table=self._table, 
            columns=self._columns, where=where)
        
        return res