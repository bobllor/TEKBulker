from db.database import Database
from typing import Any

class Settings:
    def __init__(self, db: Database):
        self.db: Database = db

        self.table: str = 'settings'
    
    def get_setting(self, setting_key: str) -> list[Any]:
        '''Return the given setting value.'''
        res: list[Any] = self.db.select(
            table=self.table, columns=['value'], where=f'setting="{setting_key}"'
        )

        if len(res) > 0:
            return res[0][0]
        
        return ''